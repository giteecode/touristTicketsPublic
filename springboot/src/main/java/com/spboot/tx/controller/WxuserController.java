package com.spboot.tx.controller;

import cn.hutool.core.bean.BeanUtil;
import com.jntoo.db.DB;
import com.jntoo.db.utils.StringUtil;
import com.spboot.tx.config.Configure;
import com.spboot.tx.mapper.*;
import com.spboot.tx.pojo.*;
import com.spboot.tx.service.*;
import com.spboot.tx.utils.*;
import io.swagger.annotations.*;
import java.io.*;
import java.util.*;
import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Api(tags = { "微信用户控制器" })
@RestController
@RequestMapping("/api/wxuser")
public class WxuserController {

    @Autowired
    public WxuserService wxuserService;

    @Resource
    private HttpServletRequest request;

    @Resource
    private HttpServletResponse response;

    @ApiOperation(value = "获取全部微信用户", httpMethod = "GET")
    @RequestMapping("/selectAll")
    public ResponseData<List<Wxuser>> selectAll() {
        return wxuserService.selectAll();
    }

    @ApiOperation(value = "根据条件筛选获取微信用户列表，并分页", httpMethod = "POST")
    @RequestMapping("/selectPages")
    public ResponseData selectPages(@RequestBody Map<String, Object> req) {
        return wxuserService.selectPages(req);
    }

    @ApiOperation(value = "根据过滤信息获取相关数据", httpMethod = "POST")
    @RequestMapping("/filter")
    public ResponseData<List<Wxuser>> filter(@RequestBody Map<String, Object> req) {
        return wxuserService.filter(req);
    }

    @ApiOperation(value = "判断用户是否登录", httpMethod = "GET")
    @RequestMapping("/isLogin")
    public ResponseData isLogin() {
        SessionUser user = Request.user();
        // 新增
        String role = user.getRoles();
        if ("管理员".equals(role)) {
            return JsonResult.success(DB.name(Admins.class).find(user.getId()));
        }
        if ("用户".equals(role)) {
            return JsonResult.success(DB.name(Yonghu.class).find(user.getId()));
        }
        return wxuserService.findById(Request.user().getId());
    }

    @Autowired
    private UsersService userService;

    @ApiOperation(value = "微信登录", notes = "登录时并更新数据到数据库中，不存在则插入数据，存在则更新数据库信息", httpMethod = "POST")
    @PostMapping("/login")
    public ResponseData<Object> wxLogin(@RequestBody Wxuser wxUser, @RequestParam String code) {
        return userService.wxLogin(code, wxUser);
    }

    @ApiOperation(value = "根据id获取信息", httpMethod = "GET")
    @RequestMapping("/findById")
    @ApiImplicitParam(name = "id", value = "评论对应的id", dataType = "Integer")
    public ResponseData findById(@RequestParam Integer id) {
        return wxuserService.findById(id);
    }

    @ApiOperation(value = "根据id更新数据", httpMethod = "POST")
    @RequestMapping("/update")
    @ApiImplicitParam(name = "data", value = "使用json数据提交", type = "json", dataTypeClass = Wxuser.class, paramType = "body")
    public ResponseData update(@RequestBody Map data) {
        Wxuser post = BeanUtil.mapToBean(data, Wxuser.class, true);
        return wxuserService.update(post, data);
    }

    @ApiOperation(value = "插入一行数据，返回插入后的评论", httpMethod = "POST")
    @RequestMapping("/insert")
    @ApiImplicitParam(name = "data", value = "使用json数据提交", type = "json", dataTypeClass = Wxuser.class, paramType = "body")
    public ResponseData insert(@RequestBody Map data) {
        Wxuser post = BeanUtil.mapToBean(data, Wxuser.class, true);
        return wxuserService.insert(post, data);
    }

    @ApiOperation(value = "根据id列表删除数据", httpMethod = "POST")
    @RequestMapping("/delete")
    @ApiImplicitParam(name = "id", value = "评论对应的id", type = "json", dataTypeClass = List.class)
    public ResponseData delete(@RequestBody List<Integer> id) {
        return wxuserService.delete(id);
    }
}
