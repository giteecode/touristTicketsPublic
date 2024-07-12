package com.spboot.tx.pojo;

import com.baomidou.mybatisplus.annotation.*;
import com.jntoo.db.*;
import java.io.Serializable;
import java.util.*;

@TableName("menpiao")
public class Menpiao implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer jingdianxinxiid;

    private String jingdianbianhao;

    private String jingdianmingcheng;

    private Integer suoshudiqu;

    private String tupian;

    private String menpiaomingcheng;

    private Double jiage;

    private Integer shuliang;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Long getGoupiaoCount() {
        return DB.name("goupiao").where("menpiaoid", id).count();
    }

    public Integer getJingdianxinxiid() {
        return jingdianxinxiid;
    }

    public void setJingdianxinxiid(Integer jingdianxinxiid) {
        this.jingdianxinxiid = jingdianxinxiid == null ? 0 : jingdianxinxiid;
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

    public String getTupian() {
        return tupian;
    }

    public void setTupian(String tupian) {
        this.tupian = tupian == null ? "" : tupian.trim();
    }

    public String getMenpiaomingcheng() {
        return menpiaomingcheng;
    }

    public void setMenpiaomingcheng(String menpiaomingcheng) {
        this.menpiaomingcheng = menpiaomingcheng == null ? "" : menpiaomingcheng.trim();
    }

    public Double getJiage() {
        return jiage;
    }

    public void setJiage(Double jiage) {
        this.jiage = jiage == null ? 0.0f : jiage;
    }

    public Integer getShuliang() {
        return shuliang;
    }

    public void setShuliang(Integer shuliang) {
        this.shuliang = shuliang == null ? 0 : shuliang;
    }
}
