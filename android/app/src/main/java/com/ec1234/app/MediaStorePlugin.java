package com.ec1234.app;

import android.Manifest;
import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

@CapacitorPlugin(
    name = "MediaStore",
    permissions = {
        @Permission(
            alias = "images",
            strings = {
                Manifest.permission.READ_MEDIA_IMAGES,
                Manifest.permission.READ_EXTERNAL_STORAGE
            }
        ),
        @Permission(
            alias = "videos",
            strings = {
                Manifest.permission.READ_MEDIA_VIDEO,
                Manifest.permission.READ_EXTERNAL_STORAGE
            }
        )
    }
)
public class MediaStorePlugin extends Plugin {

    @PluginMethod
    public void getMedia(PluginCall call) {
        JSArray mediaList = new JSArray();
        ContentResolver contentResolver = getContext().getContentResolver();

        // Query Images
        queryMediaType(contentResolver, MediaStore.Images.Media.EXTERNAL_CONTENT_URI, false, mediaList);

        // Query Videos
        queryMediaType(contentResolver, MediaStore.Video.Media.EXTERNAL_CONTENT_URI, true, mediaList);

        JSObject result = new JSObject();
        result.put("media", mediaList);
        call.resolve(result);
    }

    private void queryMediaType(ContentResolver resolver, Uri contentUri, boolean isVideo, JSArray mediaList) {
        String[] projection = {
            MediaStore.MediaColumns._ID,
            MediaStore.MediaColumns.DISPLAY_NAME,
            MediaStore.MediaColumns.DATE_ADDED,
            MediaStore.MediaColumns.SIZE,
            MediaStore.MediaColumns.WIDTH,
            MediaStore.MediaColumns.HEIGHT,
            MediaStore.MediaColumns.MIME_TYPE,
            MediaStore.MediaColumns.DATA
        };

        String sortOrder = MediaStore.MediaColumns.DATE_ADDED + " DESC";

        try (Cursor cursor = resolver.query(contentUri, projection, null, null, sortOrder)) {
            if (cursor != null) {
                int idColumn = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns._ID);
                int nameColumn = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DISPLAY_NAME);
                int dateColumn = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DATE_ADDED);
                int sizeColumn = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.SIZE);
                int widthColumn = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.WIDTH);
                int heightColumn = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.HEIGHT);
                int mimeColumn = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.MIME_TYPE);
                int dataColumn = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DATA);

                int limit = 200;
                int count = 0;

                while (cursor.moveToNext() && count < limit) {
                    long id = cursor.getLong(idColumn);
                    String name = cursor.getString(nameColumn);
                    long dateAddedSec = cursor.getLong(dateColumn);
                    long sizeBytes = cursor.getLong(sizeColumn);
                    int width = cursor.getInt(widthColumn);
                    int height = cursor.getInt(heightColumn);
                    String mimeType = cursor.getString(mimeColumn);
                    String dataPath = cursor.getString(dataColumn);

                    Uri mediaItemUri = Uri.withAppendedPath(contentUri, String.valueOf(id));
                    
                    // Fallback to mediaItemUri.toString() or bridge local URL
                    String webPath = "";
                    try {
                        webPath = getBridge().getLocalUrl(mediaItemUri);
                    } catch (Exception e) {
                        webPath = mediaItemUri.toString();
                    }

                    JSObject item = new JSObject();
                    item.put("id", (isVideo ? "v_" : "i_") + id);
                    item.put("title", name != null ? name : "Untitled");
                    item.put("description", "Local media from " + (isVideo ? "video" : "image") + " library");
                    item.put("url", webPath);
                    item.put("thumbnailUrl", webPath);
                    item.put("uriString", mediaItemUri.toString());
                    
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
                    String dateStr = sdf.format(new Date(dateAddedSec * 1000));
                    item.put("dateAdded", dateStr);
                    
                    item.put("album", isVideo ? "Videos" : "Camera");
                    item.put("mimeType", mimeType != null ? mimeType : (isVideo ? "video/mp4" : "image/jpeg"));
                    
                    double sizeMb = (double) sizeBytes / (1024 * 1024);
                    item.put("size", String.format(Locale.US, "%.2f MB", sizeMb));
                    item.put("width", width > 0 ? width : 1920);
                    item.put("height", height > 0 ? height : 1080);
                    item.put("isFavorite", false);
                    item.put("isSynced", true);
                    item.put("isInTrash", false);
                    item.put("trashTimeLeftDays", null);
                    item.put("localPath", dataPath);

                    JSObject exif = new JSObject();
                    exif.put("camera", "Device Camera");
                    exif.put("lens", "Default Lens");
                    exif.put("aperture", "f/1.8");
                    exif.put("exposureTime", "1/120s");
                    exif.put("iso", "100");
                    exif.put("focalLength", "24mm");
                    
                    JSObject location = new JSObject();
                    location.put("latitude", 23.8103);
                    location.put("longitude", 90.4125);
                    location.put("address", "Dhaka, Bangladesh");
                    exif.put("location", location);
                    
                    item.put("exif", exif);
                    
                    JSArray tags = new JSArray();
                    tags.put(isVideo ? "video" : "image");
                    tags.put("local");
                    item.put("tags", tags);

                    mediaList.put(item);
                    count++;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
