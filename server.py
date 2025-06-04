from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app,origins=["null", "http://localhost:9001", "http://127.0.0.1:8080"], supports_credentials=True)

@app.route("/convert", methods=["POST"])
def convert():
    data = request.get_json() # This will parse the JSON body

    board = data.get('board')
    children = data.get('children')
    if not data:
        return {"error": "No JSON received"}, 400

    try:
        xml,gradient_xml = convert_penpot_to_android_xml(board, children)
        return {"xml": f"xml files:\n{xml} \n\n gradient_xml files:\n{gradient_xml}"}, 200
    except Exception as e:
        return {"error": str(e)}, 500

def convert_penpot_to_android_xml(board: dict, children: list) :

    def calc(px):
        dp = (int(px)*160)//840
        return dp

    def to_dp(px):
        return f"{calc(px)}dp"
    

    def generate_gradient_drawable(fills: list) -> str:
        if not fills or not isinstance(fills, list):
            return ""

        fill = fills[0]
        gradient = fill.get("fillColorGradient")
        if not gradient:
            return ""

        start_x = gradient["startX"]
        start_y = gradient["startY"]
        end_x = gradient["endX"]
        end_y = gradient["endY"]
        stops = gradient.get("stops", [])

        # Determine Android angle based on start/end (approximation)
        angle = int(((1 - end_y + start_y) * 90 + (end_x - start_x) * 90)) % 360

        start_color = stops[0]["color"]
        end_color = stops[-1]["color"]

        # Optional: add center color if 3 stops
        center_color = None
        if len(stops) == 3:
            center_color = stops[1]["color"]

        drawable = (
            '<?xml version="1.0" encoding="utf-8"?>\n'
            '<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">\n'
            '<gradient\n'
            f'    android:type="linear"\n'
            f'    android:angle="{angle}"\n'
            f'    android:startColor="{start_color}"\n'
        )
        if center_color:
            drawable += f'    android:centerColor="{center_color}"\n'
        drawable += (
            f'    android:endColor="{end_color}"\n'
            f'    android:gradientRadius="90dp"\n'
            f'    android:useLevel="false"/>\n'
        )
        drawable += '</shape>\n'

        return drawable


    def get_background_xml(fills):
        gradient_xml = "No gradient"
        if not fills or not isinstance(fills, list):
            return 'android:background="#FFFFFF"',gradient_xml
        fill = fills[0]
        
        if "fillColorGradient" in fill:
            # Gradient handling placeholder — you'd use a drawable file in real Android
            gradient_xml = generate_gradient_drawable(fills)
            return 'android:background="@drawable/gradient_background"',gradient_xml
        return f'android:background="{fill.get("color", "#FFFFFF")}"',gradient_xml

    def convert_shape(shape, indent=4):
        i = ' ' * indent
        shape_type = shape.get("type")
        name = shape.get("name", "Unnamed")
        x = shape.get("x", 0)
        y = shape.get("y", 0)
        width = shape.get("width", 0)
        height = shape.get("height", 0)

        layout = (
            f'{i}android:layout_width="{to_dp(width)}"\n'
            f'{i}android:layout_height="{to_dp(height)}"\n'
            f'{i}android:layout_marginLeft="{to_dp(x)}"\n'
            f'{i}android:layout_marginTop="{to_dp(y)}"'
        )

        xml = ""
        btn_gradient = "No gradient"
        if shape_type == "group":
            xml += f'{i}<FrameLayout\n{layout}>\n'
            for child in shape.get("children", []):
                xml,btn_gradient = convert_shape(child, indent + 2)
                xml += xml
            xml += f'{i}</FrameLayout>\n'

        elif shape_type == "rectangle":
            background_xml,btn_gradient = get_background_xml(shape.get("fills"))
            xml += (
                f'{i}<View\n{layout}\n'              
                f'{i}{background_xml}/>\n'

            )

        elif shape_type == "text":
            xml += (
                f'{i}<TextView\n{layout}\n'
                f'{i}android:text="{shape.get("characters", "")}"\n'
                f'{i}android:textSize="{shape.get("fontSize", "14")}sp"\n'
                f'{i}android:textColor="#FFFFFF"/>\n'
            )

        else:
            xml += f'{i}<!-- Unknown shape type: {shape_type} -->\n'

        return xml,btn_gradient




    board_width = to_dp(board.get("width", 360))
    board_height = to_dp(board.get("height", 640))
    board_background,gradient_xml = get_background_xml(board.get("fills"))

    
    xml = (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"\n'
        f'    android:layout_width="{board_width}"\n'
        f'    android:layout_height="{board_height}"\n'
        f'    {board_background}>\n'
    )

    

    gradient_xmls = [gradient_xml]  # Start with board background gradient
    for child in children:
        child_xml, btn_gradient = convert_shape(child, indent=4)
        xml += child_xml
        if btn_gradient and btn_gradient != "No gradient":
            gradient_xmls.append(btn_gradient)

    # Combine all gradient XMLs (if needed)
    final_gradient_xml = "\n\n".join(gradient_xmls)


    xml += '</FrameLayout>'
    #xml += f'Button gradient : \n {btn_gradient}'
        
        
    return xml, final_gradient_xml




if __name__ == "__main__":
    app.run(port=4001,debug=True,host="0.0.0.0")


# def generate_android_xml(objects):
#     xml = '<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"\n' \
#           '    android:layout_width="match_parent"\n' \
#           '    android:layout_height="match_parent">\n\n'
#     num = 0
#     for obj in objects:       
#         print("obj no: ",num+1)
#         bounds = obj.get("bounds", {})
#         width = f'{round(bounds.get("width", 100))}dp'
#         height = f'{round(bounds.get("height", 50))}dp'
#         marginLeft = f'android:layout_marginLeft="{round(bounds.get("x", 0))}dp"'
#         marginTop = f'android:layout_marginTop="{round(bounds.get("y", 0))}dp"'
#         bgColor = "#cccccc"

#         if obj["type"] == "text":
#             text = obj.get("characters", "Text")
#             fontSize = obj.get("fontSize", "16")
#             xml += f'    <TextView\n' \
#                    f'        android:layout_width="{width}"\n' \
#                    f'        android:layout_height="{height}"\n' \
#                    f'        android:text="{text}"\n' \
#                    f'        android:textSize="{fontSize}sp"\n' \
#                    f'        {marginLeft} {marginTop}\n' \
#                    f'        android:textColor="#000000" />\n\n'
#         elif obj["type"] in ["rectangle", "shape"]:
#             xml += f'    <View\n' \
#                    f'        android:layout_width="{width}"\n' \
#                    f'        android:layout_height="{height}"\n' \
#                    f'        {marginLeft} {marginTop}\n' \
#                    f'        android:background="{bgColor}" />\n\n'

#     xml += '</RelativeLayout>'
#     return xml


# xml = {}
#     gradient_xml = {}

#     for board in board:

#         num = len(board)

#         board_width = to_dp(board.get("width", 360))
#         board_height = to_dp(board.get("height", 640))
#         board_background,gradient_background = get_background_xml(board.get("fills"))

        
#         xml[f"Board:{num}"] = (
#             '<?xml version="1.0" encoding="utf-8"?>\n'
#             '<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"\n'
#             f'    android:layout_width="{board_width}"\n'
#             f'    android:layout_height="{board_height}"\n'
#             f'    {board_background}>\n'
#         )

        

#         for child in children:
#             xml[f"Board:{num}"] += convert_shape(child, indent=4)

#         xml[f"Board:{num}"] += '</FrameLayout>'
#         gradient_xml[f"Board:{num}"] = gradient_background
        
#     return xml,gradient_xml
