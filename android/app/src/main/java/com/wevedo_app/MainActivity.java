package com.wevedo_app;

import android.os.Bundle;
import android.content.Intent;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

import com.reactnativenavigation.controllers.SplashActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    // @Override
    protected String getMainComponentName() {
        return "wevedo_app";
    }

    @Override
        public void onNewIntent(Intent intent) {
            super.onNewIntent(intent);
            setIntent(intent);
        }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }
}
