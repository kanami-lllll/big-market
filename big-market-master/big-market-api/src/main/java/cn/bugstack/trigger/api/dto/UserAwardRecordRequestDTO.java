package cn.bugstack.trigger.api.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 用户中奖记录查询请求。
 */
@Data
public class UserAwardRecordRequestDTO implements Serializable {

    private String userId;

    private Long activityId;

}
