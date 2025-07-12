#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Lägg till denna import för att få tillgång till Manager-traitens metoder som get_webview_window
use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {

      let window = app.get_webview_window("main").unwrap(); 

      window.set_min_size(Some(tauri::Size::Logical(tauri::LogicalSize::new(1280.0, 960.0))))
            .expect("Failed to set min window size");

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
