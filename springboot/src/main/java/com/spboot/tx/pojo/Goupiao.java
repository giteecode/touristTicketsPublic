package com.spboot.tx.pojo;

import com.baomidou.mybatisplus.annotation.*;
import com.jntoo.db.*;
import java.io.Serializable;
import java.util.*;

@TableName("goupiao")
public class Goupiao implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    private Integer menpiaoid;

    private Integer jingdianxinxiid;

    private String jingdianbianhao;

    private String jingdianmingcheng;

    private Integer suoshudiqu;

    private String menpiaomingcheng;

    private Double jiage;

    private String shijian;

    private Integer goumaishuliang;

    private Double xiaoji;

    private String zhuangtai;

    private String goumairen;
    private String iszf;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getMenpiaoid() {
        return menpiaoid;
    }

    public void setMenpiaoid(Integer menpiaoid) {
        this.menpiaoid = menpiaoid == null ? 0 : menpiaoid;
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

    public String getShijian() {
        return shijian;
    }

    public void setShijian(String shijian) {
        this.shijian = shijian == null ? "" : shijian.trim();
    }

    public Integer getGoumaishuliang() {
        return goumaishuliang;
    }

    public void setGoumaishuliang(Integer goumaishuliang) {
        this.goumaishuliang = goumaishuliang == null ? 0 : goumaishuliang;
    }

    public Double getXiaoji() {
        return xiaoji;
    }

    public void setXiaoji(Double xiaoji) {
        this.xiaoji = xiaoji == null ? 0.0f : xiaoji;
    }

    public String getZhuangtai() {
        return zhuangtai;
    }

    public void setZhuangtai(String zhuangtai) {
        this.zhuangtai = zhuangtai == null ? "" : zhuangtai.trim();
    }

    public String getGoumairen() {
        return goumairen;
    }

    public void setGoumairen(String goumairen) {
        this.goumairen = goumairen == null ? "" : goumairen.trim();
    }

    public String getIszf() {
        return iszf;
    }

    public void setIszf(String iszf) {
        this.iszf = iszf == null ? "" : iszf.trim();
    }
}
