package cn.bugstack.domain.activity.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeliveryOrderEntity {

    /**
     * 用户ID
     */
    private String userId;
    /**
     * 业务仿重ID - 外部透传。返利、行为等唯一标识
     */
    private String outBusinessNo;

}
