import {queryUserAwardRecordList} from "@/apis";
import {UserAwardRecordVO} from "@/types/UserAwardRecordVO";
import {getDemoParams} from "@/utils/demoParams";
import React, {useEffect, useState} from "react";

// @ts-ignore
export function UserAwardRecords({refresh}) {
    const [records, setRecords] = useState<UserAwardRecordVO[]>([]);
    const [loading, setLoading] = useState(false);

    const queryUserAwardRecordsHandle = async () => {
        const {userId, activityId} = getDemoParams();
        setLoading(true);
        try {
            const result = await queryUserAwardRecordList(userId, activityId);
            const {code, data}: { code: string; info: string; data: UserAwardRecordVO[] } = await result.json();
            if (code !== "0000") {
                setRecords([]);
                return;
            }
            setRecords(data || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        queryUserAwardRecordsHandle().then(() => {
        });
    }, [refresh]);

    const formatAwardTime = (awardTime?: string) => {
        if (!awardTime) return "-";
        return new Date(awardTime).toLocaleString();
    };

    const stateText = (awardState?: string) => {
        if (awardState === "completed" || awardState === "complete") return "发奖完成";
        if (awardState === "create") return "发奖中";
        if (awardState === "fail") return "发奖失败";
        return awardState || "-";
    };

    return (
        <section className="mb-8 w-full max-w-4xl rounded-2xl bg-white/95 p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <div className="text-xl font-black text-gray-900">我的奖品</div>
                    <div className="text-xs text-gray-500">展示当前访客的中奖记录，数据来自后端 user_award_record 分表。</div>
                </div>
                <button
                    onClick={queryUserAwardRecordsHandle}
                    className="rounded-full bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-700"
                >
                    {loading ? "刷新中..." : "刷新"}
                </button>
            </div>

            {records.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                    暂无中奖记录。抽奖成功后会在这里展示。
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-3">奖品</th>
                            <th className="px-4 py-3">状态</th>
                            <th className="px-4 py-3">中奖时间</th>
                            <th className="px-4 py-3">订单号</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map((record) => (
                            <tr key={record.orderId} className="border-t border-gray-100">
                                <td className="px-4 py-3 font-bold text-gray-900">{record.awardTitle}</td>
                                <td className="px-4 py-3 text-gray-700">{stateText(record.awardState)}</td>
                                <td className="px-4 py-3 text-gray-600">{formatAwardTime(record.awardTime)}</td>
                                <td className="px-4 py-3 font-mono text-xs text-gray-500">{record.orderId}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
