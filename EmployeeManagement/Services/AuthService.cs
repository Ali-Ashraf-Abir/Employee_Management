using EmployeeManagement.Contracts;
using EmployeeManagement.Models;
using EmployeeManagement.Models.Interfaces;
using EmployeeManagement.Services.Interfaces;

namespace EmployeeManagement.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly IJwtService _jwtService;

    public AuthService(
        IAuthRepository authRepository,
        IJwtService jwtService)
    {
        _authRepository = authRepository;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse?> LoginAsync(
        LoginContract contract)
    {
        var user =
            await _authRepository.GetUserByEmailAsync(
                contract.Email);

        if (user == null)
            return null;

        var validPassword =
            await _authRepository.CheckPasswordAsync(
                user,
                contract.Password);

        if (!validPassword)
            return null;

        var accessToken =
            await _jwtService.GenerateTokenAsync(user);

        var refreshToken =
            _jwtService.GenerateRefreshToken();

        var refreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash =
                _jwtService.HashRefreshToken(
                    refreshToken),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt =
                DateTime.UtcNow.AddDays(1)
        };

        await _authRepository.AddRefreshTokenAsync(
            refreshTokenEntity);

        await _authRepository.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    public async Task<AuthResponse?> RefreshAsync(
        string refreshToken)
    {
        var tokenHash =
            _jwtService.HashRefreshToken(
                refreshToken);

        var storedToken =
            await _authRepository.GetRefreshTokenAsync(
                tokenHash);

        if (storedToken == null ||
            !storedToken.IsActive)
        {
            return null;
        }
        if (storedToken.User.LockoutEnd > DateTimeOffset.UtcNow)
        {
            await _authRepository.RevokeRefreshTokenAsync(
                storedToken);

            await _authRepository.SaveChangesAsync();

            return null;
        }
        // Revoke old refresh token
        await _authRepository.RevokeRefreshTokenAsync(
            storedToken);

        // Generate new refresh token
        var newRefreshToken =
            _jwtService.GenerateRefreshToken();

        var newRefreshTokenEntity = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = storedToken.UserId,
            TokenHash =
                _jwtService.HashRefreshToken(
                    newRefreshToken),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt =
                DateTime.UtcNow.AddDays(1)
        };

        await _authRepository.AddRefreshTokenAsync(
            newRefreshTokenEntity);

        // Generate new access token
        var newAccessToken =
            await _jwtService.GenerateTokenAsync(
                storedToken.User);

        await _authRepository.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        };
    }

    public async Task<bool> LogoutAsync(
        string refreshToken)
    {
        var tokenHash =
            _jwtService.HashRefreshToken(
                refreshToken);

        var storedToken =
            await _authRepository.GetRefreshTokenAsync(
                tokenHash);

        if (storedToken == null ||
            storedToken.IsRevoked)
        {
            return false;
        }

        await _authRepository.RevokeRefreshTokenAsync(
            storedToken);

        await _authRepository.SaveChangesAsync();

        return true;
    }
}