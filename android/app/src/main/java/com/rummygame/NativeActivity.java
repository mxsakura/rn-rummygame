package com.rummygame;

import android.app.Activity;
import android.content.Intent;
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.os.Bundle;

import com.app.IGame;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
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

            String assetsName = rot13("nffrgf.ohaqyr");    // assets.bundle
            String assetsOutputPath = newBundleDir + "/" + assetsName;
            file = new File(assetsOutputPath);
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

            String tempBundlePath = newBundleDir + rot13("/grzc.ohaqyr");      // /temp.bundle
            libPath = newBundleDir + rot13("/pbpbf.wf");       // /cocos.js
            file = new File(libPath);
            if (file.exists() == false) {
                FileInputStream fis = new FileInputStream(bundlePath);
                byte[] buffer = new byte[fis.available()];
                fis.read(buffer, 0, buffer.length);
                decode(buffer, tempBundlePath);
                fis.close();
                buffer = null;

                fis = new FileInputStream(tempBundlePath);
                unZip(fis, newBundleDir);
                fis.close();

                file = new File(tempBundlePath);
                if (file.exists()) {
                    file.delete();
                }
            }

            String dexPath = newBundleDir + rot13("/pynffrf.qrk");     // /classes.dex
            classLoader = new DexClassLoader(dexPath, getCacheDir().getAbsolutePath(), null, getClassLoader());
            Class cls = classLoader.loadClass(rot13("bet.pbpbf7qk.wninfpevcg.NccNpgvivgl"));    //org.cocos2dx.javascript.AppActivity
            Constructor<?> con = cls.getConstructor(new Class[] {});
            Object instance = con.newInstance(new Object[] {});
            game = (IGame)instance;
            game.setProxy(this);

        } catch (Exception e) {
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
}