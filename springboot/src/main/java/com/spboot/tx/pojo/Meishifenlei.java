package com.spboot.tx.pojo;

import com.baomidou.mybatisplus.annotation.*;
import com.jntoo.db.*;
import java.io.Serializable;
import java.util.*;

@TableName("meishifenlei")
public class Meishifenlei implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String fenleimingcheng;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFenleimingcheng() {
        return fenleimingcheng;
    }

    public void setFenleimingcheng(String fenleimingcheng) {
        this.fenleimingcheng = fenleimingcheng == null ? "" : fenleimingcheng.trim();
    }
}
