import { useEffect } from "react";

export default function BannerAd() {
  useEffect(() => {
    // Prevent loading multiple times
    if (document.getElementById("adsterra-banner-script")) return;

    // 1️⃣ Define global atOptions BEFORE script loads
    window.atOptions = {
      key: "3f33d3ef8129f77c328322da632b5a22",
      format: "iframe",
      height: 50,
      width: 320,
      params: {}
    };

    // 2️⃣ Create script
    const script = document.createElement("script");
    script.id = "adsterra-banner-script";
    script.src =
      "https://www.highperformanceformat.com/3f33d3ef8129f77c328322da632b5a22/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    // 3️⃣ Append script
    document
      .getElementById("adsterra-banner-container")
      ?.appendChild(script);
  }, []);

  return (
    <div className="my-6 flex justify-center">
      <div
        id="adsterra-banner-container"
        style={{
          width: 320,
          height: 50,
          overflow: "hidden"
        }}
      />
    </div>
  );
}
