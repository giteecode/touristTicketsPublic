package com.spboot.tx.controller;

import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.google.code.kaptcha.impl.DefaultKaptcha;
import com.jntoo.db.DB;
import com.jntoo.db.QueryMap;
import com.jntoo.db.utils.StringUtil;
import com.spboot.tx.config.Configure;
import com.spboot.tx.pojo.*;
import com.spboot.tx.service.*;
import com.spboot.tx.utils.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.*;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Api(tags = { "用户登录" }, description = "登录接口")
@RestController
@RequestMapping("/api/user")
public class UsersController {

    @Autowired
    private UsersService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtils jwtTokenUtils;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private DefaultKaptcha kaptcha;

    @ApiOperation(value = "后台账号密码登录", httpMethod = "POST")
    @PostMapping("/login")
    @ApiImplicitParams(
        {
            @ApiImplicitParam(name = "username", value = "用户名", required = true, type = "String"),
            @ApiImplicitParam(name = "pwd", value = "密码", required = true, type = "String"),
            @ApiImplicitParam(name = "cx", value = "登录权限", required = true, type = "String"),
        }
    )
    public ResponseData<Object> login(@RequestParam String username, @RequestParam String pwd, @RequestParam String cx) {
        if (StringUtil.isNullOrEmpty(username)) {
            return JsonResult.error("请填写用户");
        }
        if (StringUtil.isNullOrEmpty(pwd)) {
            return JsonResult.error("请填写密码");
        }
        if (StringUtil.isNullOrEmpty(cx)) {
            return JsonResult.error("请填写角色");
        }

        if (request.getParameter("a") != null) {
            if (StrUtil.hasBlank(request.getParameter("pagerandom"))) {
                return JsonResult.error("请填写验证码");
            }
            String token = jwtTokenUtils.getUserIdFromToken(request.getParameter("captchToken"));
            if (!token.equals(request.getParameter("pagerandom"))) {
                return JsonResult.error("验证码错误请重新输入");
            }
        }

        Map result = new HashMap();
        if (cx.equals("管理员")) {
            String password = pwd;

            Admins user = DB.name(Admins.class).where("username", username).where("pwd", password).find();
            if (user == null) {
                return JsonResult.error("账号或密码错误");
            }
            Map<String, Object> m = new HashMap();
            m.put("id", user.getId());
            m.put("username", username);
            m.put("roles", cx);

            m.put("cx", user.getCx());

            String token = jwtTokenUtils.generateToken(user.getId(), m);
            m.put("userId", user.getId());

            result.put("session", m);
            result.put("token", token);
            result.put("user", user);
        }
        if (cx.equals("用户")) {
            String password = pwd;

            Yonghu user = DB.name(Yonghu.class).where("yonghuming", username).where("mima", password).find();
            if (user == null) {
                return JsonResult.error("账号或密码错误");
            }
            Map<String, Object> m = new HashMap();
            m.put("id", user.getId());
            m.put("username", username);
            m.put("roles", cx);

            m.put("cx", cx);

            String token = jwtTokenUtils.generateToken(user.getId(), m);
            m.put("userId", user.getId());

            result.put("session", m);
            result.put("token", token);
            result.put("user", user);
        }

        return JsonResult.success(result);
    }

    @ApiOperation(value = "微信端用户登录", httpMethod = "POST")
    @PostMapping("/wxlogin")
    public ResponseData wxlogin(@RequestBody Map<String, Object> map) {
        if (StringUtil.isNullOrEmpty(map.get("username"))) {
            return JsonResult.error("请填写用户");
        }
        if (StringUtil.isNullOrEmpty(map.get("password"))) {
            return JsonResult.error("请填写密码");
        }
        if (StringUtil.isNullOrEmpty(map.get("cx"))) {
            return JsonResult.error("请填写角色");
        }
        String username = String.valueOf(map.get("username"));
        String password = String.valueOf(map.get("password"));
        String cx = String.valueOf(map.get("cx"));
        Map result = new HashMap();
        if (cx.equals("管理员")) {
            Admins user = DB.name(Admins.class).where("username", username).where("pwd", password).find();
            if (user == null) {
                return JsonResult.error("账号或密码错误");
            }
            Map<String, Object> m = new HashMap();
            m.put("id", user.getId());
            m.put("username", username);
            m.put("roles", cx);

            m.put("cx", user.getCx());

            String token = jwtTokenUtils.generateToken(user.getId(), m);
            m.put("userId", user.getId());

            result.put("session", m);
            result.put("token", token);
            result.put("user", user);
        }
        if (cx.equals("用户")) {
            Yonghu user = DB.name(Yonghu.class).where("yonghuming", username).where("mima", password).find();
            if (user == null) {
                return JsonResult.error("账号或密码错误");
            }
            Map<String, Object> m = new HashMap();
            m.put("id", user.getId());
            m.put("username", username);
            m.put("roles", cx);

            m.put("cx", cx);

            String token = jwtTokenUtils.generateToken(user.getId(), m);
            m.put("userId", user.getId());

            result.put("session", m);
            result.put("token", token);
            result.put("user", user);
        }
        return JsonResult.success(result);
    }

    @ApiOperation(value = "生成验证码", httpMethod = "GET")
    @GetMapping("/captch")
    public ResponseData createCaptch() {
        String code = createRandomString(4);
        BufferedImage image = kaptcha.createImage(code);
        String base64 = createBase64Png(image);

        Map result = new HashMap();
        result.put("token", jwtTokenUtils.generateToken(code, new HashMap()));
        result.put("url", base64);

        return JsonResult.success(result);
    }

    @RequestMapping("/select")
    public ResponseData select(@RequestBody Map<String, Object> data) {
        String sql = String.valueOf(data.get("sql"));
        String type = String.valueOf(data.get("type"));
        List binds = null;
        if (data.containsKey("binds") && data.get("binds") instanceof List) {
            binds = (List) data.get("binds");
        } else {
            binds = new ArrayList();
        }

        Object[] datas = binds.toArray();
        if ("execute".equals(type)) {
            return JsonResult.success(DB.execute(sql, datas));
        } else if ("select".equals(type)) {
            return JsonResult.success(DB.select(sql, datas));
        } else {
            return JsonResult.success(DB.find(sql, datas));
        }
    }

    private String createBase64Png(BufferedImage bufferedImage) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream(); //io流
            ImageIO.write(bufferedImage, "png", baos); //写入流中
            byte[] bytes = baos.toByteArray(); //转换成字节
            //BASE64Encoder encoder = new BASE64Encoder();
            String png_base64 = Base64Utils.encode(bytes); //encoder.encodeBuffer(bytes).trim(); //转换成base64串
            png_base64 = png_base64.replaceAll("\n", "").replaceAll("\r", ""); //删除 \r\n

            //        ImageIO.write(bufferedImage, "png", new File("D:/qrcode1.png"));
            //System.out.println("值为："+"data:image/jpg;base64,"+png_base64);
            return "data:image/png;base64," + png_base64;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    @ApiOperation(value = "退出登录", httpMethod = "POST")
    @PostMapping("/logout")
    public ResponseData<Object> logout() {
        return JsonResult.success("ok");
    }

    /**
     * 使用ajax 检测某表中某列字段是否已存在，已存在则无法提交
     * @return
     */
    @PostMapping(value = "/checkno")
    @ApiOperation(value = "使用ajax 检测某表中某列字段是否已存在，已存在则无法提交", httpMethod = "POST")
    @ApiImplicitParams(
        {
            @ApiImplicitParam(name = "table", value = "表名称", required = true, type = "String"),
            @ApiImplicitParam(name = "col", value = "列字段名", required = true, type = "int"),
            @ApiImplicitParam(name = "checktype", value = "检测类型、只允许是insert、update", required = true, type = "String"),
            @ApiImplicitParam(name = "id", value = "当类型为update时此值必填", type = "Integer"),
        }
    )
    @ResponseBody
    public String checkon(@RequestParam String table, @RequestParam String col, @RequestParam String checktype) {
        String value = request.getParameter(col);
        QueryMap queryMap = DB.name(table);
        queryMap.where(col, value);
        if (checktype.equals("update")) {
            String id = request.getParameter("id");
            queryMap.where("id", "neq", id);
        }
        if (queryMap.count() > 0) {
            return "false";
        } else {
            return "true";
        }
    }

    @PostMapping("/query")
    @ApiOperation(value = "根据参数查询数据库信息", httpMethod = "POST")
    public ResponseData<Object> query(@RequestBody Map map) {
        return userService.query(map);
    }

    /**
     * 审核数据，将是否审核改为已审核状态，点击一下 是 则变否， 点击一下 否 变为是
     * @return 成功与否
     */
    @PostMapping("/sh")
    @ApiOperation(value = "审核数据，将是否审核改为已审核状态，点击一下 是 则变否， 点击一下 否 变为是", httpMethod = "POST")
    @ApiImplicitParams(
        {
            @ApiImplicitParam(name = "yuan", value = "原值", required = true, type = "String"),
            @ApiImplicitParam(name = "id", value = "表得行id", required = true, type = "int"),
            @ApiImplicitParam(name = "tablename", value = "模块名称", required = true, type = "String"),
        }
    )
    public ResponseData<Object> sh(@RequestParam String yuan, @RequestParam int id, @RequestParam String tablename) {
        DB.name(tablename).where("id", id).setField("issh", yuan.equals("是") ? "否" : "是");
        return JsonResult.success(yuan.equals("是") ? "否" : "是");
    }

    /**
     * 获取表的某行数据
     * @return
     */
    @PostMapping("/tableAjax")
    @ResponseBody
    @ApiOperation(value = "获取表的某行数据", httpMethod = "POST")
    @ApiImplicitParams(
        {
            @ApiImplicitParam(name = "table", value = "模块名称", required = true, type = "String"),
            @ApiImplicitParam(name = "id", value = "表得行id", required = true, type = "int"),
        }
    )
    public String tableFind(@RequestParam String table, @RequestParam int id) {
        Map map = DB.name(table).where("id", id).find();
        //JSONObject json = JSONObject.parse(map);
        return JSON.toJSONString(map); //.toString();
    }

    /**
     *   获取某表得某行数据
     *
     */
    @PostMapping("/selectView")
    @ApiOperation(value = "获取某表得某行数据", httpMethod = "POST")
    @ApiImplicitParams(
        {
            @ApiImplicitParam(name = "key", value = "字段名", required = true, type = "String"),
            @ApiImplicitParam(name = "value", value = "值", required = true, type = "String"),
            @ApiImplicitParam(name = "table", value = "模块名称", required = true, type = "String"),
        }
    )
    public ResponseData<Object> selectView(@RequestParam String table, @RequestParam String key, @RequestParam String value) {
        Map data = DB.name(table).where(key, value).find();
        return JsonResult.success(data);
    }

    /**
     *   获取某表得所有数据
     */
    @PostMapping("/selectAll")
    @ApiOperation(value = "获取某表得所有数据", httpMethod = "POST")
    @ApiImplicitParams(
        {
            @ApiImplicitParam(name = "where", value = "条件", required = false, type = "String"),
            @ApiImplicitParam(name = "table", value = "模块名称", required = true, type = "String"),
        }
    )
    public ResponseData<Object> selectAll(@RequestParam String where, @RequestParam String table) {
        QueryMap query = DB.name(table);

        if (where != null) {
            JSONObject wss = JSON.parseObject(where);
            for (Map.Entry<String, Object> entry : wss.entrySet()) {
                String key = (String) entry.getKey();
                Object value = entry.getValue();
                if (value instanceof JSONObject) {
                    JSONObject w = (JSONObject) value;
                    query.where(key, w.getString("exp"), w.getString("value"));
                } else if (value instanceof JSONArray) {
                    JSONArray w = (JSONArray) value;
                    query.where(key, (String) w.get(0), w.get(1));
                } else {
                    query.where(key, value);
                }
            }
        }
        if (request.getParameter("limit") != null) {
            query.limit(Request.get("limit"));
        }
        if (request.getParameter("order") != null) {
            query.order(Request.get("order"));
        }
        if (request.getParameter("field") != null) {
            query.field(Request.get("field"));
        }
        List list = query.select();
        return JsonResult.success(list);
    }

    /**
     * 搜索下拉某表的数据
     * @return
     */
    @RequestMapping("/selectUpdateSearch")
    @ResponseBody
    @ApiOperation(value = "获取某表得所有数据", httpMethod = "POST")
    @ApiImplicitParams(
        { @ApiImplicitParam(name = "where", value = "条件", type = "String"), @ApiImplicitParam(name = "table", value = "模块名称", required = true, type = "String") }
    )
    public String selectUpdateSearch(@RequestParam String where, @RequestParam String table) {
        QueryMap query = DB.name(table);
        String limit = "50";
        JSONObject ws = JSON.parseObject(Request.get("where"));
        for (Map.Entry entry : ws.entrySet()) {
            String key = (String) entry.getKey();
            Object value = entry.getValue();
            if ("limit".equals(key)) {
                limit = String.valueOf(value);
            } else {
                if (value instanceof JSONObject) {
                    JSONObject w = (JSONObject) value;
                    query.where(key, w.getString("exp"), w.getString("value"));
                } else if (value instanceof JSONArray) {
                    JSONArray w = (JSONArray) value;
                    query.where(key, (String) w.get(0), w.get(1));
                } else {
                    query.where(key, value);
                }
            }
        }
        List list = query.order("id desc").limit(limit).select();
        return JSON.toJSONString(list);
    }

    /**
     * 生成验证码字符串
     *
     * @param len
     * @return
     */
    private String createRandomString(int len) {
        // 生成随机数类
        Random random = new Random();
        String result = "";
        for (int i = 0; i < len; i++) {
            String rand = String.valueOf(random.nextInt(10));
            result += rand;
        }
        return result;
    }

    @PostMapping("/upload_re")
    @ApiOperation(value = "获取某表得所有数据", httpMethod = "POST")
    @ApiImplicitParams({ @ApiImplicitParam(name = "fujian", value = "条件", type = "file", allowMultiple = true, required = true) })
    public ResponseData<Object> upload(@RequestPart(value = "fujian") MultipartFile fujian) throws IOException {
        String fileName = fujian.getOriginalFilename();
        String suffix = fileName.substring(fileName.lastIndexOf("."));
        String newName = IdUtil.simpleUUID() + suffix;

        String uploadPath = Configure.UPLOAD_DIR + newName;
        File file = new File(uploadPath);
        FileUtils.forceMkdirParent(file);
        FileUtils.copyInputStreamToFile(fujian.getInputStream(), file);
        String url = Configure.FILE_PREFIX + newName;
        return JsonResult.success(url);
    }
}
