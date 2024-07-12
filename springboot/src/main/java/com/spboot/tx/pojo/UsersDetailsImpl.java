package com.spboot.tx.pojo;

import com.spboot.tx.utils.SessionUser;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UsersDetailsImpl implements UserDetails {

    private Integer id;
    private String username;
    private String password;
    private Integer roleId;
    private String roles;
    private String cx;

    public UsersDetailsImpl(Admins yonghu) {
        cx = yonghu.getCx();
        id = yonghu.getId();
        username = yonghu.getUsername();
        password = yonghu.getPwd();
        roleId = 0;
        roles = "admin";
    }

    public UsersDetailsImpl(Wxuser user) {
        cx = "小程序";
        id = user.getId();
        username = user.getOpenid();
        password = "";
        roles = "";
        roleId = 0;
    }

    public UsersDetailsImpl(SessionUser user) {
        cx = user.getCx();
        id = user.getId();
        username = user.getUsername();
        password = user.getPwd();
        roles = "";
        roleId = 0;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public String getCx() {
        return cx;
    }

    public void setCx(String cx) {
        this.cx = cx;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
