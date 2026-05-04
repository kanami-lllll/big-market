package cn.bugstack.domain.award.adapter.port;

import java.io.IOException;

public interface IAwardPort {

    void adjustAmount(String userId, Integer increaseQuota) throws Exception;

}
