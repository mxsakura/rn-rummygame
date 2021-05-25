package com.rummygame;

import android.app.Activity;
import android.content.Intent;
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.app.IGame;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.security.MessageDigest;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import dalvik.system.DexClassLoader;

public class NativeActivity extends Activity implements IGame {

    private IGame game = null;
    private ClassLoader classLoader = null;
    private String bundlePath = "";
    private String libPath = null;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bundlePath = getIntent().getStringExtra(rot13("cngu")); //path
        load();

        Bundle bundle = new Bundle();
        bundle.putString(rot13("yvo"), libPath);   //lib
        game.onCreate(bundle);
    }

    @Override
    public void onResume() {
        super.onResume();
        if (game == null) {
            return;
        }

        game.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        if (game == null) {
            return;
        }

        game.onPause();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (game == null) {
            return;
        }

        game.onDestroy();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (game == null) {
            return;
        }

        game.onWindowFocusChanged(hasFocus);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (game == null) {
            return;
        }

        game.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (game == null) {
            return;
        }

        game.onNewIntent(intent);
    }

    @Override
    public void onRestart() {
        super.onRestart();
        if (game == null) {
            return;
        }

        game.onRestart();
    }

    @Override
    public void onStop() {
        super.onStop();
        if (game == null) {
            return;
        }

        game.onStop();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        if (game == null) {
            return;
        }

        game.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (game == null) {
            return;
        }

        game.onConfigurationChanged(newConfig);
    }

    @Override
    public void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        if (game == null) {
            return;
        }

        game.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (game == null) {
            return;
        }

        game.onSaveInstanceState(outState);
    }

    @Override
    public void onStart() {
        super.onStart();
        if (game == null) {
            return;
        }

        game.onStart();
    }

    @Override
    public void setProxy(Activity activity) { }

    @Override
    public ClassLoader getClassLoader() {
        if (classLoader != null) {
            return classLoader;
        }

        return super.getClassLoader();
    }

    private void load() {

        try {
            AssetManager as = getAssets();
            String newBundleDir = getFilesDir().getAbsolutePath() + rot13("/ohaqyr");  // /bundle
            File file = new File(newBundleDir);
            if (file.exists() == false) {
                file.mkdirs();
            }

            String assetsMD5 = readTextFile(rot13("nffrgf.zq0"), true);     //assets.md5
            String assetsName = rot13("nffrgf.ohaqyr");    // assets.bundle
            String assetsOutputPath = newBundleDir + "/" + assetsName;
            file = new File(assetsOutputPath);
            if (file.exists() == true) {
                String curMD5 = MD5(assetsOutputPath);
                if (assetsMD5.equals(curMD5) == false) {
                    file.delete();
                }
            }

            if (file.exists() == false) {
                InputStream is = as.open(assetsName);
                byte[] buffer = new byte[is.available()];
                is.read(buffer, 0, buffer.length);
                decode(buffer, assetsOutputPath);
                is.close();
                buffer = null;
            }

            Method m = AssetManager.class.getMethod(rot13("nqqNffrgCngu"), String.class);  //addAssetPath
            m.invoke(as, assetsOutputPath);

            String soName = rot13("pbpbf.wf");       // /cocos.js
            String dexName = rot13("pynffrf.qrk");     // /classes.dex
            libPath = newBundleDir + "/" + soName;
            String dexPath = newBundleDir + "/" + dexName;
            String bundleMD5Path = newBundleDir + rot13("/ohaqyr.zq0");  //bundle.md5
            boolean needExtra = true;
            file = new File(bundleMD5Path);
            if (file.exists() == true) {
                String md5Content = readTextFile(bundleMD5Path, false);
                try {
                    JSONObject json = new JSONObject(md5Content);
                    String md51 = json.getString(dexName);
                    String md52 = json.getString(soName);
                    if (TextUtils.isEmpty(md51) || TextUtils.isEmpty(md52)) {
                        needExtra = true;
                    } else {
                        String curMD51 = MD5(dexPath);
                        String curMD52 = MD5(libPath);
                        if (md51.equals(curMD51) && md52.equals(curMD52)) {
                            needExtra = false;
                        }
                    }
                } catch (JSONException ex) {
                    ex.printStackTrace();
                    needExtra = true;
                    Log.i("NativeActivity", "NativeActivity load need extra");
                }
            }

            if (needExtra == true) {
                FileInputStream fis = new FileInputStream(bundlePath);
                unZip(fis, newBundleDir);
                fis.close();
            }

            classLoader = new DexClassLoader(dexPath, getFilesDir().getAbsolutePath(), null, getClassLoader());
            Class cls = classLoader.loadClass(rot13("bet.pbpbf7qk.wninfpevcg.NccNpgvivgl"));    //org.cocos2dx.javascript.AppActivity
            Constructor<?> con = cls.getConstructor(new Class[] {});
            Object instance = con.newInstance(new Object[] {});
            game = (IGame)instance;
            game.setProxy(this);

        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    private void decode(byte[] buffer, String outputPath) {
        try {
            FileOutputStream os = new FileOutputStream(outputPath);
            int endOffset = buffer.length - 4;
            final int blockSize = 256;
            int offset = 4;
            while (true) {

                if (offset >= endOffset) {
                    break;
                }

                int startIndex = offset;
                int endIndex = offset + blockSize;
                int writeLen = blockSize;
                if (endIndex > endOffset) {
                    writeLen = endOffset - offset;
                } else {
                    int halfIndex = (startIndex + endIndex) / 2;
                    for (int i = startIndex; i < halfIndex; i++) {
                        int swapIndex = startIndex + endIndex - i - 1;
                        byte tmp = buffer[i];
                        buffer[i] = buffer[swapIndex];
                        buffer[swapIndex] = tmp;
                    }
                }

                os.write(buffer, offset, writeLen);
                os.flush();
                offset += writeLen;
            }
            os.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void unZip(InputStream is, String extractDir) {

        try {
            BufferedOutputStream dest = null;
            ZipInputStream zis = new ZipInputStream(is);
            ZipEntry entry = null;
            final int buffSize = 5120;
            byte data[] = new byte[buffSize];
            while ((entry = zis.getNextEntry()) != null) {
                File file = new File(extractDir + File.separator + entry.getName());
                if (entry.isDirectory()) {
                    if (file.exists() == false) {
                        file.mkdirs();
                        continue;
                    }
                }

                if (file.exists()) {
                    file.delete();
                }

                int count = 0;
                FileOutputStream fos = new FileOutputStream(file);
                dest = new BufferedOutputStream(fos, buffSize);
                while ((count = zis.read(data, 0, buffSize)) != -1) {
                    dest.write(data, 0, count);
                }
                dest.flush();
                dest.close();
            }
            zis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String rot13(String str) {
        int len = str.length();
        String newStr = "";
        for (int i = 0; i < len; i++) {
            char ch = str.charAt(i);
            int newCh = ch;
            if (ch >= 'a' && ch <= 'z') {
                newCh = ch + 13;
                if (newCh > 'z') {
                    newCh = ch - 13;
                }
            } else if (ch >= 'A' && ch <= 'Z') {
                newCh = ch + 13;
                if (newCh > 'Z') {
                    newCh = ch - 13;
                }
            } else if (ch >= '0' && ch <= '9') {
                newCh = ch + 5;
                if (newCh > '9') {
                    newCh = ch - 5;
                }
            }

            newStr += String.valueOf((char)newCh);
        }

        return newStr;
    }

    private String MD5(String filepath) {
        try {

            File file = new File(filepath);
            if (file.exists() == false) {
                return "";
            }

            MessageDigest md = MessageDigest.getInstance("MD5");
            FileInputStream inputStream = new FileInputStream(filepath);
            byte[] buffer = new byte[1024 * 10]; // 10 KB Buffer

            int read;
            while ((read = inputStream.read(buffer)) != -1) {
                md.update(buffer, 0, read);
            }

            StringBuilder hexString = new StringBuilder();
            for (byte digestByte : md.digest()) {
                hexString.append(String.format("%02x", digestByte));
            }

            return hexString.toString();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return "";
    }

    private String readTextFile(String path, boolean isAssets) {
        try {
            InputStream is = null;
            if (isAssets) {
                is = getAssets().open(path);
            } else {
                is = new FileInputStream(path);
            }
            byte[] bytes = new byte[is.available()];
            is.read(bytes, 0, bytes.length);
            is.close();
            String str = new String(bytes, "UTF-8");
            return str;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "";
    }


}