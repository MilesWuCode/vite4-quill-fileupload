const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

// 設定multer的存儲設置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// 設定multer的限制
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1000, // 限制檔案大小為1MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("只允許上傳圖片文件！"));
    }
    cb(null, true);
  },
});

// 處理檔案上傳請求
app
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  })
  .post("/upload", (req, res) => {
    upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // 捕獲檔案上傳錯誤，修改http code為413，並返回JSON格式的錯誤訊息
        res
          .status(413)
          .json({ error: { message: "上傳的檔案大小超過了1MB的限制！" } });
      } else if (err) {
        // 捕獲其他錯誤，返回JSON格式的錯誤訊息
        res.status(500).json({ error: { message: err.message } });
      } else {
        // 返回成功的JSON格式響應
        res.status(200).json({
          url: req.protocol + "://" + req.get("host") + "/" + req.file.path,
        });
      }
    });
  });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 啟動服務器
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
