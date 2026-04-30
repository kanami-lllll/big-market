import {queryRaffleStrategyRuleWeight} from "@/apis";
import {useEffect, useState} from "react";
import {StrategyAward, StrategyRuleWeightVO} from "@/types/StrategyRuleWeightVO";
import {getDemoParams} from "@/utils/demoParams";

type StrategyRuleWeightProps = {
    refresh: number;
};

type RuleNodeProps = {
    index: number;
    threshold: number;
    completed: number;
    awards: StrategyAward[];
};

function RuleNode({index, threshold, completed, awards}: RuleNodeProps) {
    const safeThreshold = Math.max(threshold, 1);
    const progressCount = Math.min(completed, safeThreshold);
    const percentage = Math.min((progressCount / safeThreshold) * 100, 100);
    const remainingCount = Math.max(safeThreshold - completed, 0);
    const isReached = completed >= safeThreshold;

    return (
        <section className="w-full rounded-2xl border border-white/30 bg-white/95 p-4 shadow-lg" style={{width: "300px"}}>
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <div className="text-sm font-bold text-gray-900">规则节点 {index + 1}</div>
                    <div className="text-xs text-gray-500">累计抽奖达到 {safeThreshold} 次时，使用该限定奖池</div>
                </div>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${isReached ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}
                >
                    {isReached ? "已达成" : `还差 ${remainingCount} 次`}
                </span>
            </div>

            <div className="mb-3">
                <div className="mb-1 flex justify-between text-xs font-semibold text-gray-700">
                    <span>当前累计 {completed} 次</span>
                    <span>{progressCount}/{safeThreshold}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-400"
                        style={{width: `${percentage}%`}}
                    />
                </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
                <div className="mb-2 text-xs font-bold text-gray-800">限定奖池</div>
                <div className="space-y-1">
                    {awards.map((award, idx) => (
                        <div key={award.awardId} className="flex items-center gap-2 text-xs text-gray-700">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white">
                                {idx + 1}
                            </span>
                            <span>{award.awardTitle}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function StrategyRuleWeight({refresh}: StrategyRuleWeightProps) {
    const [strategyRuleWeightVOList, setStrategyRuleWeightVOList] = useState<StrategyRuleWeightVO[]>([]);
    const totalUseCount = strategyRuleWeightVOList[0]?.userActivityAccountTotalUseCount ?? 0;

    const queryRaffleStrategyRuleWeightHandle = async () => {
        const {userId, activityId} = getDemoParams();
        const result = await queryRaffleStrategyRuleWeight(userId, activityId);
        const {code, info, data}: { code: string; info: string; data: StrategyRuleWeightVO[] } = await result.json();

        if (code != "0000") {
            window.alert("查询抽奖规则节点失败 code:" + code + " info:" + info);
            return;
        }

        setStrategyRuleWeightVOList([...data].sort((a, b) => a.ruleWeightCount - b.ruleWeightCount));
    };

    useEffect(() => {
        queryRaffleStrategyRuleWeightHandle();
    }, [refresh]);

    if (!strategyRuleWeightVOList.length) {
        return null;
    }

    return (
        <div className="mb-8 w-full max-w-5xl rounded-3xl bg-black/20 p-6 text-white backdrop-blur">
            <div className="mb-5">
                <div className="text-2xl font-black">动态奖池规则</div>
                <p className="mt-2 max-w-3xl text-sm text-white/85">
                    当前用户累计抽奖 {totalUseCount} 次。下面这些节点来自后端 rule_weight 配置，
                    用来演示“用户累计行为次数达到指定节点后，抽奖策略切换到限定奖池”。
                </p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
                {strategyRuleWeightVOList.map((ruleWeight, index) => (
                    <RuleNode
                        key={ruleWeight.ruleWeightCount}
                        index={index}
                        threshold={ruleWeight.ruleWeightCount}
                        completed={ruleWeight.userActivityAccountTotalUseCount}
                        awards={ruleWeight.strategyAwards}
                    />
                ))}
            </div>
        </div>
    );
}
