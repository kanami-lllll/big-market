"use client";

import {LuckyWheelPage} from "@/app/pages/lucky/lucky-wheel-page";
import {LuckyGridPage} from "@/app/pages/lucky/lucky-grid-page";
import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import {activityStrategyArmory} from "@/apis";
import {getDemoActivityId} from "@/utils/demoParams";

const StrategyArmoryButton = dynamic(async () => (await import("./components/StrategyArmory")).StrategyArmory);
const StrategyRuleWeightButton = dynamic(async () => (await import("./components/StrategyRuleWeight")).StrategyRuleWeight);
const MemberCardButton = dynamic(async () => (await import("./components/MemberCard")).MemberCard);
const SkuProductButton = dynamic(async () => (await import("./components/SkuProduct")).SkuProduct);
const UserAwardRecords = dynamic(async () => (await import("./components/UserAwardRecords")).UserAwardRecords);

export default function Home() {
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        activityStrategyArmory(getDemoActivityId())
            .catch((error) => console.error("Failed to armory activity", error));
    }, []);

    const handleRefresh = () => {
        setRefresh((value) => value + 1);
    };

    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center bg-[#e7305e] px-4"
            style={{backgroundImage: "url('/background.svg')"}}
        >
            <header className="my-8 text-center text-5xl font-black text-white md:text-7xl">
                大营销平台 - 抽奖链路展示
            </header>

            <MemberCardButton allRefresh={refresh}/>

            <UserAwardRecords refresh={refresh}/>

            <StrategyArmoryButton/>

            <SkuProductButton handleRefresh={handleRefresh}/>

            <section className="mb-4 max-w-4xl rounded-2xl bg-white/90 p-4 text-center text-sm text-gray-700 shadow-lg">
                <div className="font-bold text-gray-900">同一套后端抽奖能力，两种前端展示皮肤</div>
                <div className="mt-1">
                    左侧转盘和右侧九宫格都会调用同一个抽奖接口，消耗同一个用户的抽奖次数，
                    并进入同一套库存扣减、订单落库和异步发奖链路。
                </div>
            </section>

            <div className="mb-8 flex flex-col gap-4 md:flex-row">
                <div className="w-full rounded-lg bg-white p-6 shadow-lg md:w-1/2">
                    <div className="mb-3">
                        <div className="text-xl font-black text-gray-900">转盘抽奖</div>
                        <div className="text-xs text-gray-500">展示形态：大转盘。业务逻辑：调用统一 draw 接口。</div>
                    </div>
                    <div className="text-gray-700">
                        <LuckyWheelPage handleRefresh={handleRefresh}/>
                    </div>
                </div>

                <div className="w-full rounded-lg bg-white p-6 shadow-lg md:w-1/2">
                    <div className="mb-3">
                        <div className="text-xl font-black text-gray-900">九宫格抽奖</div>
                        <div className="text-xs text-gray-500">展示形态：九宫格。业务逻辑：同样调用统一 draw 接口。</div>
                    </div>
                    <div className="text-gray-700">
                        <LuckyGridPage handleRefresh={handleRefresh}/>
                    </div>
                </div>
            </div>

            <StrategyRuleWeightButton refresh={refresh}/>

            <footer className="my-8 text-center text-sm text-white">
                本页面用于展示抽奖策略、库存扣减、订单落库、异步发奖和运营后台查询链路。
            </footer>
        </div>
    );
}
