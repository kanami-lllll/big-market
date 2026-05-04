package cn.bugstack.domain.auth.service;

public interface IAuthService {

    boolean checkToken(String token);

    String openid(String token);

}
