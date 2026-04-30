package cn.bugstack.infrastructure.adapter.repository;

import cn.bugstack.querys.adapter.repository.IESUserRaffleOrderRepository;
import cn.bugstack.querys.model.valobj.ESUserRaffleOrderVO;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

/**
 * @author Fuzhengwei bugstack.cn @小傅哥
 * @description
 * @create 2024-09-21 10:14
 */
@Slf4j
@Repository
public class ESUserRaffleOrderRepository implements IESUserRaffleOrderRepository {

    @Value("${spring.elasticsearch.rest.url:http://elasticsearch:9200}")
    private String elasticsearchRestUrl;

    @Override
    public List<ESUserRaffleOrderVO> queryESUserRaffleOrderVOList() {
        try {
            JSONObject request = new JSONObject();
            request.put("query", "select _user_id, _activity_id, _activity_name, _strategy_id, _order_id, _order_time, _order_state, _create_time, _update_time from \"big_market.user_raffle_order\" order by _update_time desc limit 10");

            JSONObject response = postJson(elasticsearchRestUrl + "/_sql?format=json", request.toJSONString());
            if (response.containsKey("error")) {
                log.warn("查询 ES 用户抽奖单失败 response:{}", response.toJSONString());
                return new ArrayList<>();
            }

            return parseSqlRows(response.getJSONArray("rows"));
        } catch (Exception e) {
            log.warn("查询 ES 用户抽奖单异常", e);
            return new ArrayList<>();
        }
    }

    private JSONObject postJson(String requestUrl, String body) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(requestUrl).openConnection();
        connection.setRequestMethod("POST");
        connection.setConnectTimeout(3000);
        connection.setReadTimeout(5000);
        connection.setDoOutput(true);
        connection.setRequestProperty("Content-Type", "application/json;charset=UTF-8");

        try (OutputStream outputStream = connection.getOutputStream()) {
            outputStream.write(body.getBytes(StandardCharsets.UTF_8));
        }

        int responseCode = connection.getResponseCode();
        InputStream inputStream = responseCode >= 200 && responseCode < 300 ? connection.getInputStream() : connection.getErrorStream();
        String responseBody = read(inputStream);
        return JSON.parseObject(responseBody);
    }

    private String read(InputStream inputStream) throws Exception {
        if (inputStream == null) {
            return "{}";
        }

        StringBuilder builder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
        }
        return builder.toString();
    }

    private List<ESUserRaffleOrderVO> parseSqlRows(JSONArray rows) {
        List<ESUserRaffleOrderVO> result = new ArrayList<>();
        if (rows == null) {
            return result;
        }

        for (int i = 0; i < rows.size(); i++) {
            JSONArray row = rows.getJSONArray(i);
            result.add(ESUserRaffleOrderVO.builder()
                    .userId(row.getString(0))
                    .activityId(toLong(row.get(1)))
                    .activityName(row.getString(2))
                    .strategyId(toLong(row.get(3)))
                    .orderId(row.getString(4))
                    .orderTime(toDate(row.getString(5)))
                    .orderState(row.getString(6))
                    .createTime(toDate(row.getString(7)))
                    .updateTime(toDate(row.getString(8)))
                    .build());
        }
        return result;
    }

    private Long toLong(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return new BigDecimal(value.toString()).longValue();
    }

    private Date toDate(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        String[] patterns = new String[]{
                "yyyy-MM-dd'T'HH:mm:ss.SSSX",
                "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                "yyyy-MM-dd HH:mm:ss"
        };
        for (String pattern : patterns) {
            try {
                SimpleDateFormat format = new SimpleDateFormat(pattern);
                format.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
                return format.parse(value);
            } catch (ParseException ignored) {
            }
        }
        throw new IllegalArgumentException("Unsupported date format: " + value);
    }

}
