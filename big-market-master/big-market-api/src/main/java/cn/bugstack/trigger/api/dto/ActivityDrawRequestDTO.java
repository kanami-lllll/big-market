package cn.bugstack.trigger.api.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ActivityDrawRequestDTO implements Serializable {

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 活动ID
     */
    private Long activityId;

}
