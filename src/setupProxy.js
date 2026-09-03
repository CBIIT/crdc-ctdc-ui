const fileResponses = {
  "dg.4DFC/dbc97b99-bc21-4c55-8b89-84bf7ef9d508": "raw",
  "dg.4DFC/38eff380-faa9-4463-81e0-5e88861ebddd": "wrapped",
  "dg.4DFC/e41ea28b-e2ec-4341-a767-86454a4751d8": "unauthorized",
  "dg.4DFC/e3ff3be6-b007-4398-9f92-23ceb1d9ed12": "forbidden",
  "dg.4DFC/d2958a9b-d3f7-4c26-b226-19d669fc6678": "invalid",
};

module.exports = (app) => {
  app.get("/mock-file-service/ras/*", (req, res) => {
    const fileId = decodeURIComponent(req.params[0]);
    const responseType = fileResponses[fileId] || "notFound";
    const downloadUrl = `${req.protocol}://${req.get("host")}/mock-file-download/test-publicdata.raw`;

    if (responseType === "raw") {
      res.type("text/plain").send(downloadUrl);
      return;
    }

    if (responseType === "wrapped") {
      res.json({ url: downloadUrl });
      return;
    }

    if (responseType === "unauthorized") {
      res.sendStatus(401);
      return;
    }

    if (responseType === "forbidden") {
      res.sendStatus(403);
      return;
    }

    if (responseType === "invalid") {
      res.type("text/plain").send("Unexpected File Service response");
      return;
    }

    res.sendStatus(404);
  });

  app.get("/mock-file-download/test-publicdata.raw", (req, res) => {
    res.attachment("test-publicdata.raw");
    res.type("text/plain").send("Local mock file download successful.");
  });
};
