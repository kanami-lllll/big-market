package cn.bugstack.trigger.api.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class SkuProductShopCartRequestDTO implements Serializable {

    /**
     * 用户ID
     */
    private String userId;
    /**
     * sku 商品
     */
    private Long sku;

}
