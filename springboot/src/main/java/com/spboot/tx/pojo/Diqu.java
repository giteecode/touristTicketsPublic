package com.spboot.tx.pojo;

import com.baomidou.mybatisplus.annotation.*;
import com.jntoo.db.*;
import java.io.Serializable;
import java.util.*;

@TableName("diqu")
public class Diqu implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String diqumingcheng;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDiqumingcheng() {
        return diqumingcheng;
    }

    public void setDiqumingcheng(String diqumingcheng) {
        this.diqumingcheng = diqumingcheng == null ? "" : diqumingcheng.trim();
    }
}
