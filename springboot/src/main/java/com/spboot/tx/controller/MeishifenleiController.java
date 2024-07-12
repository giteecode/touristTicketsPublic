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

@Api(tags = { "美食分类控制器" })
@RestController
@RequestMapping("/api/meishifenlei")
public class MeishifenleiController {

    @Autowired
    public MeishifenleiService meishifenleiService;

    @Resource
    private HttpServletRequest request;

    @Resource
    private HttpServletResponse response;

    @ApiOperation(value = "获取全部美食分类", httpMethod = "GET")
    @RequestMapping("/selectAll")
    public ResponseData<List<Meishifenlei>> selectAll() {
        return meishifenleiService.selectAll();
    }

    @ApiOperation(value = "根据条件筛选获取美食分类列表，并分页", httpMethod = "POST")
    @RequestMapping("/selectPages")
    public ResponseData selectPages(@RequestBody Map<String, Object> req) {
        return meishifenleiService.selectPages(req);
    }

    @ApiOperation(value = "根据过滤信息获取相关数据", httpMethod = "POST")
    @RequestMapping("/filter")
    public ResponseData<List<Meishifenlei>> filter(@RequestBody Map<String, Object> req) {
        return meishifenleiService.filter(req);
    }

    @ApiOperation(value = "根据id获取信息", httpMethod = "GET")
    @RequestMapping("/findById")
    @ApiImplicitParam(name = "id", value = "美食分类对应的id", dataType = "Integer")
    public ResponseData findById(@RequestParam Integer id) {
        return meishifenleiService.findById(id);
    }

    @ApiOperation(value = "根据id更新数据", httpMethod = "POST")
    @RequestMapping("/update")
    @ApiImplicitParam(name = "data", value = "使用json数据提交", type = "json", dataTypeClass = Meishifenlei.class, paramType = "body")
    public ResponseData update(@RequestBody Map data) {
        Meishifenlei post = BeanUtil.mapToBean(data, Meishifenlei.class, true);
        return meishifenleiService.update(post, data);
    }

    @ApiOperation(value = "插入一行数据，返回插入后的美食分类", httpMethod = "POST")
    @RequestMapping("/insert")
    @ApiImplicitParam(name = "data", value = "使用json数据提交", type = "json", dataTypeClass = Meishifenlei.class, paramType = "body")
    public ResponseData insert(@RequestBody Map data) {
        Meishifenlei post = BeanUtil.mapToBean(data, Meishifenlei.class, true);
        return meishifenleiService.insert(post, data);
    }

    @ApiOperation(value = "根据id列表删除数据", httpMethod = "POST")
    @RequestMapping("/delete")
    @ApiImplicitParam(name = "id", value = "美食分类对应的id", type = "json", dataTypeClass = List.class)
    public ResponseData delete(@RequestBody List<Integer> id) {
        return meishifenleiService.delete(id);
    }
}
