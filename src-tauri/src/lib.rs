use tauri::{Manager, PhysicalPosition, PhysicalSize, WebviewWindow, WebviewWindowBuilder};

fn tile_windows_side_by_side<R: tauri::Runtime>(
    main_window: &WebviewWindow<R>,
    storybook_window: &WebviewWindow<R>,
) -> tauri::Result<()> {
    let monitor = main_window
        .current_monitor()?
        .or(main_window.primary_monitor()?);

    if let Some(monitor) = monitor {
        let work_area = monitor.work_area();
        let main_width = work_area.size.width.saturating_mul(6) / 10;
        let storybook_width = work_area.size.width.saturating_sub(main_width);
        let origin_x = work_area.position.x;
        let origin_y = work_area.position.y;

        main_window.set_position(PhysicalPosition::new(origin_x, origin_y))?;
        main_window.set_size(PhysicalSize::new(main_width, work_area.size.height))?;

        storybook_window.set_position(PhysicalPosition::new(
            origin_x + main_width as i32,
            origin_y,
        ))?;
        storybook_window.set_size(PhysicalSize::new(storybook_width, work_area.size.height))?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;

                if let Some(side_window_config) = app
                    .config()
                    .app
                    .windows
                    .iter()
                    .find(|window| window.label == "side")
                {
                    let storybook_window =
                        WebviewWindowBuilder::from_config(app, side_window_config)?.build()?;

                    if let Some(main_window) = app.get_webview_window("main") {
                        tile_windows_side_by_side(&main_window, &storybook_window)?;
                    }
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
