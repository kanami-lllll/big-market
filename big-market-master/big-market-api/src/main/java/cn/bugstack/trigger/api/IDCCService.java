package cn.bugstack.trigger.api;

import cn.bugstack.trigger.api.response.Response;

public interface IDCCService {

    Response<Boolean> updateConfig(String key, String value);

}
