package cn.bugstack.infrastructure.dao;

import cn.bugstack.infrastructure.dao.po.UserRaffleOrder;
import cn.bugstack.middleware.db.router.annotation.DBRouter;
import cn.bugstack.middleware.db.router.annotation.DBRouterStrategy;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@DBRouterStrategy(splitTable = true)
public interface IUserRaffleOrderDao {

    void insert(UserRaffleOrder userRaffleOrder);

    @DBRouter
    UserRaffleOrder queryNoUsedRaffleOrder(UserRaffleOrder userRaffleOrderReq);

    int updateUserRaffleOrderStateUsed(UserRaffleOrder userRaffleOrderReq);

}
