// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use enigo::*;
use clipboard_win::{formats, set_clipboard};
use std::{
    thread,
    time::Duration,
};

fn sleep(ms: u64) {
    thread::sleep(Duration::from_millis(ms));
}

#[tauri::command]
fn paste(x: i32, y: i32, text: String) {
    thread::spawn(move || {
        set_clipboard(formats::Unicode, text).unwrap();

        let mut enigo = Enigo::new();

        enigo.mouse_move_to(x, y);
        sleep(100);
        enigo.mouse_click(MouseButton::Left);
        sleep(100);
        enigo.key_down(Key::Control);
        sleep(100);
        enigo.key_click(Key::Layout('v'));
        sleep(100);
        enigo.key_up(Key::Control);
        sleep(100);
        enigo.key_click(Key::Return);
    });
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![paste])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
