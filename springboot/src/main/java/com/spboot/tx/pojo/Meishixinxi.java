package com.spboot.tx.pojo;

import com.baomidou.mybatisplus.annotation.*;
import com.jntoo.db.*;
import java.io.Serializable;
import java.util.*;

@TableName("meishixinxi")
public class Meishixinxi implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String meishibianhao;

    private String meishimingcheng;

    private String meishitupian;

    private Integer fenlei;

    private String meishijieshao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMeishibianhao() {
        return meishibianhao;
    }

    public void setMeishibianhao(String meishibianhao) {
        this.meishibianhao = meishibianhao == null ? "" : meishibianhao.trim();
    }

    public String getMeishimingcheng() {
        return meishimingcheng;
    }

    public void setMeishimingcheng(String meishimingcheng) {
        this.meishimingcheng = meishimingcheng == null ? "" : meishimingcheng.trim();
    }

    public String getMeishitupian() {
        return meishitupian;
    }

    public void setMeishitupian(String meishitupian) {
        this.meishitupian = meishitupian == null ? "" : meishitupian.trim();
    }

    public Integer getFenlei() {
        return fenlei;
    }

    public void setFenlei(Integer fenlei) {
        this.fenlei = fenlei == null ? 0 : fenlei;
    }

    public String getMeishijieshao() {
        return meishijieshao;
    }

    public void setMeishijieshao(String meishijieshao) {
        this.meishijieshao = meishijieshao == null ? "" : meishijieshao.trim();
    }
}
