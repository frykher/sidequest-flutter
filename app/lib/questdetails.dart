import 'package:flutter/material.dart';

class QuestDetailsPage extends StatefulWidget {
  @override
  _QuestDetailsPageState createState() => _QuestDetailsPageState();
}

class _QuestDetailsPageState extends State<QuestDetailsPage> {
  bool isPressed = false;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Quest Details"),
      ),
      body: Center(child: Column(children: [
        const SizedBox(height: 30),
        Text('Quest Name: ', style: TextStyle(fontSize: 30)),
        const SizedBox(height: 10),
        Text('Quest Code: '),
        const SizedBox(height: 10),
        Text('Prerequisite: '),
        const SizedBox(height: 10),
        Text('Description: '),
        const SizedBox(height: 10),
        Text('Amount of Favorites: '),
        const SizedBox(height: 30),
        Container(
              height: 250,
              width: 450,
              decoration: ShapeDecoration(
                  shape: StarBorder(points: 5, rotation: 0, innerRadiusRatio: 0.4, pointRounding: 0, valleyRounding: 0, squash: 0),
                  color: isPressed ? Colors.yellow : Colors.grey, ),
              child: TextButton(
                onPressed: () {
                  setState(() {
                    isPressed = !isPressed;
                  });
                },
                child: Text(
                  'Favorite!',
                  style: TextStyle(color: Colors.white, fontSize: 25),
                ),
              ),
            ),
      ]
      )
      )
    );
  }
}