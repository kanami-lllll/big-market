package cn.bugstack.trigger.api;

import cn.bugstack.trigger.api.dto.RebateRequestDTO;
import cn.bugstack.trigger.api.request.Request;
import cn.bugstack.trigger.api.response.Response;

public interface IRebateService {

    Response<Boolean> rebate(Request<RebateRequestDTO> request);

}
