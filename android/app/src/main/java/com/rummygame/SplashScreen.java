package com.rummygame;

import android.app.Activity;
import android.app.Dialog;


public class SplashScreen {
    private static Dialog mSplashDialog;
    // 显示启动页
    public static void show(final Activity activity) {
        mSplashDialog = new Dialog(activity,R.style.Dialog_Fullscreen); // 设置dialog全屏
        mSplashDialog.setContentView(R.layout.activity_launch); // 设置dialog内容
        mSplashDialog.setCancelable(false);
        mSplashDialog.show();
    }
    // 关闭启动页
    public static void hide(Activity activity) {
        if (mSplashDialog == null) {
            return;
        }
        
        mSplashDialog.dismiss();
        mSplashDialog = null;
    }
}