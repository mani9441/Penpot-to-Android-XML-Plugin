import React, { Children, useEffect, useState } from "react";

export default function App() {
  const [xmlOutput, setXmlOutput] = useState<string>("");

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const msg = event.data;
      if (msg?.type === "selection") {
        console.log("Received board data:", msg.board);
        console.log("Received child data:", msg.children);
        //const xml = generateAndroidXml(msg.data);
        //setXmlOutput(xml);
        
        sendToPythonServer(msg.board, msg.children);
      }
    });
  }, []);


  const sendToPythonServer = async (board,children) => {
    const res = await fetch("http://localhost:4001/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board: board,
        children: children,
      }),
    });

    const result = await res.json();
    if (result.xml) {
      setXmlOutput(result.xml); // update your UI here
    } else {
      console.error("Error from server:", result.error);
    }
  };





  return (
    <div style={{ padding: "1rem" }}>
      <h2>Android XML Layout</h2>
      <textarea
        value={xmlOutput}
        readOnly
        rows={20}
        style={{ width: "100%", fontFamily: "monospace", fontSize: "14px" }}
      />
    </div>
  );
}




// const sendToPythonServer = async (board, children) => {
//   try {
//     // Make a POST request to the Python server
//     const res = await fetch("http://localhost:4001/convert", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json", // Specify that the body is JSON
//       },
//       // Stringify both parameters into a single JSON object
//       body: JSON.stringify({
//         board: board, 
//         children: children, 
//       }),
//     });

//     // Check if the response was successful (status code 2xx)
//     if (!res.ok) {
//       const errorData = await res.json(); // Attempt to parse error message from server
//       throw new Error(`Server responded with status ${res.status}: ${errorData.error || res.statusText}`);
//     }

//     // Parse the JSON response from the server
//     const result = await res.json();

//     // Check if the server returned 'xml' data
//     if (result.xml) {
//       // Assuming setXmlOutput is a function (e.g., a React setState) to update your UI
//       // You would replace this with your actual UI update logic.
//       setXmlOutput(result.xml);
//       console.log("XML output received and updated:", result.xml);
//     } else {
//       // Log any other errors returned from the server's JSON response
//       console.error("Error from server (no XML field):", result.error || "Unknown error");
//     }
//   } catch (error) {
//     // Catch any network errors or errors thrown from the response handling
//     console.error("Failed to send data to Python server:", error);
//     // Optionally, you might want to update your UI to show an error message to the user
//     // setErrorStatus(error.message);
//   }
// };




// const sendToPythonServer = async (designData: any) => {
//   const res = await fetch("http://localhost:4001/convert", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(designData),
//   });

//   const result = await res.json();
//   if (result.xml) {
//     setXmlOutput(result.xml); // update your UI here
//   } else {
//     console.error("Error from server:", result.error);
//   }
// };


// const generateAndroidXml = (data: any[]): string => {
//   if (!Array.isArray(data) || data.length === 0) return '';

//   let xml = `<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"\n` +
//             `    android:layout_width="match_parent"\n` +
//             `    android:layout_height="match_parent">\n\n`;

//   data.forEach((obj, index) => {
//     const {
//       type,
//       name,
//       bounds,
//       x,
//       y,
//       characters,
//       fontSize,
//       fontFamily,
//       fontWeight,
//       fills,
//       borderRadius,
//       borderRadiusTopLeft,
//       borderRadiusTopRight,
//       borderRadiusBottomLeft,
//       borderRadiusBottomRight,
//     } = obj;

//     const width = bounds?.width ? `${Math.round(bounds.width)}dp` : 'wrap_content';
//     const height = bounds?.height ? `${Math.round(bounds.height)}dp` : 'wrap_content';
//     const marginLeft = x ? `android:layout_marginLeft="${Math.round(x)}dp"` : '';
//     const marginTop = y ? `android:layout_marginTop="${Math.round(y)}dp"` : '';
//     const idAttr = `android:id="@+id/${type}_${index}"`;

//     let background = '';
//     if (fills?.[0]) {
//       const fill = fills[0];
//       if (fill.fillColor) {
//         background = `android:background="${fill.fillColor}"`;
//       } else if (fill.fillColorGradient) {
//         background = `android:background="@drawable/gradient_${index}"`; // Suggest to use drawable XML
//       }
//     }

//     const radiusAttrs = [
//       borderRadiusTopLeft ?? borderRadius,
//       borderRadiusTopRight ?? borderRadius,
//       borderRadiusBottomRight ?? borderRadius,
//       borderRadiusBottomLeft ?? borderRadius,
//     ].some(v => v != null) ? `android:background="@drawable/rounded_${index}"` : background;

//     if (type === 'text') {
//       xml += `  <TextView\n` +
//              `      ${idAttr}\n` +
//              `      android:layout_width="${width}"\n` +
//              `      android:layout_height="${height}"\n` +
//              `      android:text="${characters || name || 'Text'}"\n` +
//              `      android:textSize="${fontSize || 14}sp"\n` +
//              `      android:fontFamily="${fontFamily || 'sans-serif'}"\n` +
//              `      android:textStyle="${fontWeight === '700' ? 'bold' : 'normal'}"\n` +
//              `      android:textColor="${fills?.[0]?.fillColor || '#000000'}"\n` +
//              `      ${marginLeft} ${marginTop} />\n\n`;
//     }

//     else if (type === 'rectangle' || type === 'shape') {
//       xml += `  <View\n` +
//              `      ${idAttr}\n` +
//              `      android:layout_width="${width}"\n` +
//              `      android:layout_height="${height}"\n` +
//              `      ${radiusAttrs}\n` +
//              `      ${marginLeft} ${marginTop} />\n\n`;
//     }

//     else if (type === 'group') {
//       xml += `  <LinearLayout\n` +
//              `      ${idAttr}\n` +
//              `      android:layout_width="${width}"\n` +
//              `      android:layout_height="${height}"\n` +
//              `      android:orientation="vertical"\n` +
//              `      ${marginLeft} ${marginTop}>\n` +
//              `      <!-- Group content placeholder -->\n` +
//              `  </LinearLayout>\n\n`;
//     }

//     // You can add more handling here for image, ellipse, boolean, path, etc.
//   });

//   xml += `</RelativeLayout>`;
//   return xml;
// };

