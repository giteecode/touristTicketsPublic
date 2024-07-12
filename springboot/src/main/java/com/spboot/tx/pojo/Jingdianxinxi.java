package com.spboot.tx.pojo;

import com.baomidou.mybatisplus.annotation.*;
import com.jntoo.db.*;
import java.io.Serializable;
import java.util.*;

@TableName("jingdianxinxi")
public class Jingdianxinxi implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String jingdianbianhao;

    private String jingdianmingcheng;

    private Integer suoshudiqu;

    private String jingquxingji;

    private String tupian;

    private String xiangqing;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Long getMenpiaoCount() {
        return DB.name("menpiao").where("jingdianxinxiid", id).count();
    }

    public String getJingdianbianhao() {
        return jingdianbianhao;
    }

    public void setJingdianbianhao(String jingdianbianhao) {
        this.jingdianbianhao = jingdianbianhao == null ? "" : jingdianbianhao.trim();
    }

    public String getJingdianmingcheng() {
        return jingdianmingcheng;
    }

    public void setJingdianmingcheng(String jingdianmingcheng) {
        this.jingdianmingcheng = jingdianmingcheng == null ? "" : jingdianmingcheng.trim();
    }

    public Integer getSuoshudiqu() {
        return suoshudiqu;
    }

    public void setSuoshudiqu(Integer suoshudiqu) {
        this.suoshudiqu = suoshudiqu == null ? 0 : suoshudiqu;
    }

    public String getJingquxingji() {
        return jingquxingji;
    }

    public void setJingquxingji(String jingquxingji) {
        this.jingquxingji = jingquxingji == null ? "" : jingquxingji.trim();
    }

    public String getTupian() {
        return tupian;
    }

    public void setTupian(String tupian) {
        this.tupian = tupian == null ? "" : tupian.trim();
    }

    public String getXiangqing() {
        return xiangqing;
    }

    public void setXiangqing(String xiangqing) {
        this.xiangqing = xiangqing == null ? "" : xiangqing.trim();
    }
}
