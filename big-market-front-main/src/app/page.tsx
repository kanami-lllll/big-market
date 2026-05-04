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
            <header className="my-8 text-center">
                <h1 className="text-5xl font-black text-white md:text-7xl">
                    大营销平台 - 抽奖链路展示
                </h1>
                <p className="mt-3 text-base font-extrabold text-amber-200 drop-shadow md:text-xl">
                    怀化学院郑岳桓制作
                </p>
            </header>

            <MemberCardButton allRefresh={refresh}/>

            <UserAwardRecords refresh={refresh}/>

            <StrategyArmoryButton/>

            <SkuProductButton handleRefresh={handleRefresh}/>

            <section className="mb-4 max-w-4xl rounded-2xl bg-white/90 p-4 text-center text-sm text-gray-700 shadow-lg">
                <div className="font-bold text-gray-900">多渠道接入演示：展示形态可替换，抽奖链路保持统一</div>
                <div className="mt-1">
                    转盘和九宫格不是两套业务，而是两个前端触点示例。它们复用同一个 draw 接口，
                    用来验证后端已把奖池选择、库存扣减、订单落库、MQ 异步发奖沉淀成统一营销能力。
                </div>
            </section>

            <div className="mb-8 flex flex-col gap-4 md:flex-row">
                <div className="w-full rounded-lg bg-white p-6 shadow-lg md:w-1/2">
                    <div className="mb-3">
                        <div className="text-xl font-black text-gray-900">渠道示例 A：转盘活动页</div>
                        <div className="text-xs text-gray-500">适合强视觉营销场景，页面形态变化不影响后端抽奖链路。</div>
                    </div>
                    <div className="text-gray-700">
                        <LuckyWheelPage handleRefresh={handleRefresh}/>
                    </div>
                </div>

                <div className="w-full rounded-lg bg-white p-6 shadow-lg md:w-1/2">
                    <div className="mb-3">
                        <div className="text-xl font-black text-gray-900">渠道示例 B：九宫格活动页</div>
                        <div className="text-xs text-gray-500">适合轻量活动入口，复用同一套规则、库存、订单和发奖能力。</div>
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
