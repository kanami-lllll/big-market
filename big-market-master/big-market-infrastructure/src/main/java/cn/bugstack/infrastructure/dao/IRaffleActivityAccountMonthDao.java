package cn.bugstack.infrastructure.dao;

import cn.bugstack.infrastructure.dao.po.RaffleActivityAccountMonth;
import cn.bugstack.middleware.db.router.annotation.DBRouter;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface IRaffleActivityAccountMonthDao {

    @DBRouter
    RaffleActivityAccountMonth queryActivityAccountMonthByUserId(RaffleActivityAccountMonth raffleActivityAccountMonthReq);

    int updateActivityAccountMonthSubtractionQuota(RaffleActivityAccountMonth raffleActivityAccountMonth);

    void insertActivityAccountMonth(RaffleActivityAccountMonth raffleActivityAccountMonth);

    void addAccountQuota(RaffleActivityAccountMonth raffleActivityAccountMonth);

}
