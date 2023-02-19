## Inspiration 💡

Forging connections between software and robotics has been an ever-increasing area of promise, especially with the proliferation of machine learning and small electronics. We’ve explored this field by creating a multilayered system, particularly inspired by use cases in sustainability.

Recycling workers, particularly *sorters*, play a paramount role in the recycling industry, and are unsung heroes of the sustainability movement. Every day they process the mountains of trash we produce, inspecting waste to ensure that recyclable materials may be used to create new commodities. Their efforts are essential in keeping our environment clean and healthy. Every can, bottle, and piece of paper that is sorted represents an incremental step in the fight against waste and environmental degradation. Sorting and processing facilities, including material recovery facilities (MRFs), pose numerous hazards to workers, such as:

1. **Exposure to harmful materials and substances**, such as used sharp objects, industrial and household chemicals, dead animals, and biohazards. The risk of exposure is heightened by fast-moving conveyor belts and the need to quickly identify hazardous materials.

2. **Moving machinery**, such as compactors, conveyor belts, and sorting machinery, which require maintenance and servicing. If lockout-tagout procedures are not followed, workers may face injury.

3. **Respiratory hazards** from dust and airborne contaminants, including micro-particles of plastics, glass, biohazards, toxic substances such as asbestos or silica, and other respiratory irritants.

4. **Awkward positions and repetitive motion injuries,** from the physical demands of sorting and processing materials.

Although sorting technologies have developed significantly, they are not able to match the fine motor skills and judgment of human workers. Thus, innovating towards streamlining the sorting process stands as an impactful contribution to both human health and the sustainability movement at large.

Having grown up in a world watching the recent advances in AI and robotics, our team was determined to use these technologies to provide better working conditions for waste sorters. We call our solution *MechaSort*.  

[![personas.png](https://i.postimg.cc/HLFH1mP6/personas.png)](https://postimg.cc/xkGBLwQm)

## What it does 🤔

MechaSort, at a high level, is a system comprising three components: a manipulator arm, a suite of sensors (vision and ultrasonic), and a software client to interface with the manipulator arm alongside basic analytics.

MechaSort addresses the aforementioned problem by replacing the waste worker with a manipulator arm on the sorting line conveyor belt. MechaSort is a prototypical "human-in the loop" system where waste workers use the sensors to identify non-recyclable waste on a software client and segregate it using a manipulator arm. 

The suite of sensors includes a camera and ultrasonic sensor, both of which can help the waste workers identify non-recyclable materials that have to be separated. On the camera, a custom computer vision model has been adapted for object detection, identifying toxic non-recyclable materials that need to be separated. The manipulator has 6 degrees of freedom allowing the robot to fully move around and manipulate any object on the fast-moving conveyor belt. The software client provides real-time analytics on object detection and a robot manipulation GUI that allows the waste worker to intuitively operate the arm remotely while also monitoring the camera feed. 

Essentially, we’ve transformed a blue-collar task (sorting waste on assembly line) into a white-collar job, where the worker can now sit in a safe office environment and sort the waste with equal if not better productivity. MechaSort’s system combines the worker's dexterous abilities and the utility of state-of-the-art object detection techniques.

Given the particular flexibility of our setup, we expect that our project’s idea can be applied in several more environments with more robust software and hardware. It would not be hard to see our setup being adapted to construction, manufacturing, or agricultural and scientific tasks. While industry work has been done for automating trash collection, our project uniquely contributes a user interface that effectively displays our system and ML model predictions, and provides a visual mode of interacting with our hardware.

[![trisystem.png](https://i.postimg.cc/mDdYgdCp/trisystem.png)](https://postimg.cc/tZxZrNrF)


## How we built it ⚙️
 
As mentioned above, the whole process can be broken into the following parts:
- React (with Chart.js) on the frontend
- Socket.io for streaming video
- xArm 1S manipulator arm (controlled via custom Arduino board), Raspberry Pi, Arduino Uno, Camera, Ultrasonic sensor, LEDs in hardware
- Flask, Ubuntu, and TensorFlow on the backend

 
[![Tech-Stack.png](https://i.postimg.cc/bJFnhZfK/Tech-Stack.png)](https://postimg.cc/CBk5CL1N)

Our project begins with our sensors, which serve as our interface with the task at hand. The Raspberry Pi camera streams video continuously. Our python backend takes in this video and runs it through our pretrained object detection model, which produces bounding boxes for various objects. On our frontend, we read in the video directly, and also opened a socket connection to our backend that allows us to draw the bounding boxes in real time. The frontend then has analytics for object detection and controls for moving the robot. Users interacting with the controls translate into API calls back into the backend, which go through an open-source library to control the robot arm.

For our object detection model, we adapted a modern, pre-trained, Transformer-based object detection model, called [DETR](https://arxiv.org/abs/2005.12872).

[![hwbi.png](https://i.postimg.cc/8Cydpp8g/hwbi.png)](https://postimg.cc/Lq1gvM6x)


## Relevant Research 📚

We fortunately found our specific use case early, which helped orient ourselves when developing the project. Here are a few of the resources that were helpful to us:

Using the ultrasonic sensor: https://www.mrelectrouino.com/2019/07/arduino-ultrasonic-sensor-hc-sr04.html


Streaming Raspberry Pi camera: https://github.com/EbenKouao/pi-camera-stream-flask/blob/master/main.py


Background reading from https://bergmill.com/2017/06/13/top-5-health-safety-risks-faced-recycling-workers/#:~:text=Waste%20and%20recyclables%20workers%20must%20often%20twist%2C%20reach%2C,of%20the%20back%2C%20shoulder%2C%20knees%2C%20hands%2C%20and%20fingers.


DETR model from https://arxiv.org/abs/2005.12872 


Library for interfacing with xArm model from https://github.com/ccourson/LewanSoul-xArm 
  
  
## Design 🎨

We followed the **Double Diamond** design process, which not only includes visual design, but a full-fledged research cycle in which you must discover and define your problem before tackling your solution and deploying it.

![DD](https://i.postimg.cc/W4bvXqDj/image-148.png)

> 1. **Discover**: a deep dive into the problem we are trying to solve.
> 2. **Define**: synthesizing the information from the discovery phase into a problem definition.
> 3. **Develop**: think up solutions to the problem.
> 4. **Deliver**: pick the best solution and build that. As it happens, we figure that our system setup is further generalizable to many use cases beyond the main problem (see above).

We used Figma & Photoshop to prototype our designs before doing any coding. Through this, we are able to get iterative feedback so that we spend less time rewriting code.
  
[![image-182.png](https://i.postimg.cc/W38D9wFP/image-182.png)](https://postimg.cc/k6VXG8vj)

## What's next? 🚀

Our aim is to make MechaSort a more robust, autonomous, and telerobotic system. The time constraints of TreeHacks meant that some parts of our system build were limited: 

Currently we interact with the robot via the SDK and an open-source interface, which connects to the robot through a USB cable. Other ways of communicating were too low-level for our scope. Given enough time, we are confident that we can study telerobotic architectures to construct a proper robot to do so.

We faced mechanical issues with the parts of our robot, and did not have time to build custom parts or modifications to better suit our setting. More in-depth work would look into using custom robotic setups which move quicker than humans, are larger, and more performant/resilient.

The DETR model can be fine-tuned to the types of objects more commonly encountered in a garbage processing environment. Combined with upgraded sensor hardware, this would lead to a more accurate and precise system for detecting objects. Indeed, we spent time over the hackathon trying to fine-tune a model, but ultimately dealt with issues when parsing the model on the backend.


## Sustainability Grand Prize🍀


In our main application area of recycling, MechaSort is an innovative system that we think addresses several sustainability challenges, particularly waste management and facilitating the transition to a green economy. By using technology to improve the safety and working conditions of sorting workers, MechaSort represents a step in the direction of making recycling more effective and efficient while also potentially creating new green jobs and promoting social equity.

Recycling stands as a large-scale way to reduce the amount of waste humans produce and slow the exploitation of natural resources. Yet in major countries such as the United States, despite its seeming popularity recycling still does not live up to what we might imagine it can do. Less than ten percent of plastics, for instance, are [recycled every year](https://www.weforum.org/agenda/2022/06/recycling-global-statistics-facts-plastic-paper/#:~:text=Of%20the%2040%20million%20tons,two%20million%20tons%20%E2%80%94%20was%20recycled.); while it is true that many materials are not intrinsically recyclable, it is also the case that there are inefficiencies in the recycling process. MechaSort addresses these challenges by improving the efficiency and accuracy of waste workers through the use of advanced sensors, computer vision, and a manipulator arm.

MechaSort can also facilitate the transition to a more environmentally-oriented economy. By enabling waste workers to sort materials while working from a safe office environment, this system not only reduces workplace accidents and injuries but also increases productivity and creates new green jobs that require advanced technological skills. By providing equitable access to these new green jobs, MechaSort promotes social equity and a just transition to a clean green economy.

Furthermore, MechaSort's potential impact extends beyond the recycling industry. The system can be adapted to other industries and applications, promoting sustainable practices and reducing the environmental impact of various sectors.

Overall, MechaSort is a solution that addresses the climate crisis and environmental injustice while promoting social equity and a just transition to a clean green economy. By recognizing this project with the Sustainability Grand Prize, we can showcase the power of technology and innovation in creating a more sustainable and equitable future for all communities.
  

[![final.png](https://i.postimg.cc/W1mz6XS9/final.png)](https://postimg.cc/hXjKK8kx)

## Most Ethically Engaged Hack by Stanford Center for Ethics & Society 👼🏻

The MechaSort system is a solution that addresses the need for better working conditions for waste sorters. It achieves this by utilizing advanced technology to replace human workers with a manipulator arm on the sorting line conveyor belt. The system allows waste workers to use sensors to identify non-recyclable waste on a software client and segregate it using a manipulator arm.

The MechaSort system offers several benefits. Firstly, it eliminates the risk of exposure to harmful chemicals and biological substances that waste sorters face daily. Secondly, it reduces the risk of injuries from moving machinery and awkward positions and repetitive motion injuries. Thirdly, it addresses respiratory hazards from dust and airborne contaminants, including micro-particles of plastics, glass, biohazards, toxic substances such as asbestos or silica, and other respiratory irritants. Finally, it eliminates the need for waste workers to work in harsh environments, which are detrimental to their health and well-being.

The MechaSort system demonstrates awareness of how the product might impact underrepresented groups. Waste sorters often belong to underrepresented communities and are therefore more vulnerable to workplace hazards. The system eliminates the need for waste workers to work in harsh environments, which is a significant step towards protecting their health and well-being.

The team has taken appropriate steps to include components in their design that addressed ethical challenges. The MechaSort system reduces the risk of workplace accidents and injuries by utilizing advanced technology to replace human workers with a manipulator arm on the sorting line conveyor belt. The system offers a safer and more efficient way of sorting waste, which ultimately benefits both workers and the environment.

The thought process behind how specific design components were included, changed, or removed altogether based on ethical considerations is well-articulated in the project submission. The MechaSort system was developed to address the need for better working conditions for waste sorters, and the team has taken a step further to ensure that the technology is used to benefit society as a whole.

In conclusion, the MechaSort system is an ethical solution to the challenges facing waste sorters in the recycling industry. It is a significant step towards creating better working conditions for waste sorters and ensuring that they are not exposed to harmful chemicals and biological substances. The team has demonstrated a high level of awareness of how the product might impact underrepresented groups and taken appropriate steps to address ethical challenges. The MechaSort system is an innovative solution that addresses a significant problem and delivers on its ambitions.
  

## Most Technically Complex Hack💪🏻

Our project incorporated several streams of technology: hardware, frontend, backend, ML, and design. Given the diverse technical backgrounds in the team we aimed for both horizontal innovation (in connecting systems that collectively solved a problem much better than they could alone) and vertical innovation (e.g. crafting a native UI system in React to come up with a novel approach to control a robot arm).

We have multiple servers running to process data in several stages. We also incorporated several sponsorship APIs and awards which again required us to incorporate several technical concepts such as sockets, streaming, networking, Vision Transformers, etc. This was all in the spirit of creating a more accurate and performant model over the time we had to develop the project.

A robotics system generally follows the following idea: measure internal state of the robot (this is measured through internal sensors, which in our case are the encoders on the servo motor of the arm), measure environment state (this is measured through external sensors which we innovated on such as the Ultrasonic sensor and camera), planning and control (in our case, we leave planning and control to the human operator or the ex-waste sorter), and actuation (which is done via the motors available on the robot).


## Best Hardware Hack👩🏻‍🔧

Our project reflects a tight integration of both hardware and software. Indeed, the time spent on our hardware builds was comparable to the time we spent working on our software product. We were able to successfully integrate three major pieces of hardware into our product, which came together with a common use:

We manually assembled an arm manipulator robot and were able to integrate its controls, normally accessible only through an iOS/Android app or through a controller, to a web frontend. We did this through the use of a open-source controller library, and interfacing with this library using a React/Flask framework.
We connected an Arduino ultrasonic sensor to our setup such that it will light up whenever objects have been detected. We found that this was beneficial for image detection.
We used a Raspberry Pi camera to aid with classification. The camera output was streamed to two sources, respectively. First, it was connected to Python code which ran our pretrained Tensorflow model every few frames to recognize objects, which were then sent to the frontend. Second, its output was also streamed directly to our frontend code running in React.

Moreover, each of the pieces were used for functional tasks, playing a meaningful role in our workflow of imaging, detecting, and classifying objects. We were able to bring together several disparate sources in our project, whose uses combined to form a real-world and useful product. 


## New Frontiers track🗡️
In this project we were able to combine technologies and tools in *novel* ways. Though the MechaSort project we displayed impressive horizontal innovation by combining the raspberry pi camera (which we use as a lightweight monitoring system), arduino uno (which we use to provide visual cues as to the location of objects to potentially be picked up), and a manipulator arm with real-time state-of-the-art object recognition techniques. We are not aware of previous projects which have attempted this combination of project features (mechanical arm, object detection, web frontend controls).


## Cotopaxi's Choice Award🎲

In our main application area of recycling, MechaSort is an innovative system that we think addresses several sustainability challenges, particularly waste management and facilitating the transition to a green economy. By using technology to improve the safety and working conditions of sorting workers, MechaSort represents a step in the direction of making recycling more effective and efficient while also potentially creating new green jobs and promoting social equity.

Recycling stands as a large-scale way to reduce the amount of waste humans produce and slow the exploitation of natural resources. Yet in major countries such as the United States, despite its seeming popularity recycling still does not live up to what we might imagine it can do. Less than ten percent of plastics, for instance, are [recycled every year](https://www.weforum.org/agenda/2022/06/recycling-global-statistics-facts-plastic-paper/#:~:text=Of%20the%2040%20million%20tons,two%20million%20tons%20%E2%80%94%20was%20recycled.); while it is true that many materials are not intrinsically recyclable, it is also the case that there are inefficiencies in the recycling process. MechaSort addresses these challenges by improving the efficiency and accuracy of waste workers through the use of advanced sensors, computer vision, and a manipulator arm.

MechaSort can also facilitate the transition to a more environmentally-oriented economy. By enabling waste workers to sort materials while working from a safe office environment, this system not only reduces workplace accidents and injuries but also increases productivity and creates new green jobs that require advanced technological skills. By providing equitable access to these new green jobs, MechaSort promotes social equity and a just transition to a clean green economy.

Furthermore, MechaSort's potential impact extends beyond the recycling industry. The system can be adapted to other industries and applications, promoting sustainable practices and reducing the environmental impact of various sectors.

Overall, MechaSort is a solution that addresses the climate crisis and environmental injustice while promoting social equity and a just transition to a clean green economy. By recognizing this project with the Sustainability Grand Prize, we can showcase the power of technology and innovation in creating a more sustainable and equitable future for all communities.

## Best Use of Dolby.io📽️

For video streaming from our Raspberry Pi, part of our project used the Dolby.io API to stream it to all the devs involved. (This ultimately didn’t make it into our final product due to more straightforward methods for streaming video from Raspberry Pi.)
  

## Best Beginner Hack👶🏻

Our team is composed of 3 first-time undergraduate hackers and 1 non-first time hacker (who also is for the first time eligible for beginner hacker prize because his first hackathon did not have such a prize). We were happy to see that despite the lack of experience in hackathons, we were able to maintain a very high attention to detail, and completed our tasks on time to deliver a project that exceeded our expectations.
  

## Most Impactful Hack🧨
Our project addresses the critical problem of the hazards faced by recycling workers, particularly sorters, on a daily basis. By combining machine learning, robotics, and software, we have created a system that strives toward efficiency and safety.

Our solution is a concrete step towards the goal of replacing the waste worker, who faces hazardous and unhealthy work conditions, with a manipulator arm on the sorting line conveyor belt, mitigating the risks of work and potentially opening the door to efficiency improvements in waste processing, leading to more ecologically effective outcomes. 

Effectively, our project aims to transform a blue-collar task into a white-collar job, making sorting waste materials safer and more efficient. We believe that our system combines the worker's dexterous abilities and the utility of state-of-the-art object detection techniques, creating an impactful solution. Furthermore, the flexibility of our setup makes it applicable to various other environments, such as construction, manufacturing, or agricultural and scientific tasks.

As a team committed to sustainability and improving human health and safety, we think our idea has the potential to change the recycling industry and other industries at large.

## Best Hack for a Real World Use Case by Pear🍐

Our project addresses the critical problem of the hazards faced by recycling workers, particularly sorters, on a daily basis. By combining machine learning, robotics, and software, we have created a system that strives toward efficiency and safety.

Our solution is a concrete step towards the goal of replacing the waste worker, who faces hazardous and unhealthy work conditions, with a manipulator arm on the sorting line conveyor belt, mitigating the risks of work and potentially opening the door to efficiency improvements in waste processing, leading to more ecologically effective outcomes. 

Effectively, our project aims to transform a blue-collar task into a white-collar job, making sorting waste materials safer and more efficient. We believe that our system combines the worker's dexterous abilities and the utility of state-of-the-art object detection techniques, creating an impactful solution. Furthermore, the flexibility of our setup makes it applicable to various other environments, such as construction, manufacturing, or agricultural and scientific tasks.

As a team committed to sustainability and improving human health and safety, we think our idea has the potential to change the recycling industry and other industries at large.

  
 ## Best Web Frontend by Vercel 🎨
  
Not only did we come up with novel hardware applications to solve our problem but also provided an easy-to-use interface for our customers to familiarize themselves with novel robotics technologies. This can be seen in our client application where we built a **novel Robotics control system in JavaScript that can control the robot using the actual links and joints of the robot and without sliders.** This system is very user friendly and makes it easy for our customers, waste sorters to get accustomed to the new robotics system.

[![control.png](https://i.postimg.cc/VLKxc1JX/control.png)](https://postimg.cc/JGB6bfch)


## Most Creative Hack✏️
Though the MechaSort project we displayed impressive horizontal innovation by combining the raspberry pi camera (which we use as a lightweight monitoring system), arduino uno (which we use to provide visual cues as to the location of objects to potentially be picked up), and a manipulator arm with real-time state-of-the-art object recognition techniques. We are not aware of previous projects which have attempted this combination of project features (mechanical arm, object detection, web frontend controls), and working on this project allowed us to engage with an interplay of both hardware and software to a depth that we hadn’t before explored.

Our streamlined interface enables users to interact with all of these systems from the same easy-to-use software client and we designed a novel interface for interacting with the manipulator arm that allows users to drag joints of a prototype arm on the site to the desired configuration which is then exactly replicated by the physical arm. We also were able to apply an object recognition model in *real time*, creating a machine learning environment in which predictions can be immediately acted upon physically.

## Most Cyberpunk Hardware Hack by Arduino⚡

Our project reflects a tight integration of both hardware and software. Indeed, the time spent on our hardware builds was comparable to the time we spent working on our software product. We were able to successfully integrate three major pieces of hardware into our product, which came together with a common use:

We manually assembled an arm manipulator robot and were able to integrate its controls, normally accessible only through an iOS/Android app or through a controller, to a web frontend. We did this through the use of a open-source controller library, and interfacing with this library using a React/Flask framework.
We connected an Arduino ultrasonic sensor to our setup such that it will light up whenever objects have been detected. We found that this was beneficial for image detection. We also built  a project on Arduino IOT cloud to provide an additional user interface for 
We used a Raspberry Pi camera to aid with classification. The camera output was streamed to two sources, respectively. First, it was connected to Python code which ran our pretrained Tensorflow model every few frames to recognize objects, which were then sent to the frontend. Second, its output was also streamed directly to our frontend code running in React.

Moreover, each of the pieces were used for functional tasks, playing a meaningful role in our workflow of imaging, detecting, and classifying objects. We were able to bring together several disparate sources from microcomputers to microcontrollers in our project, whose uses combined to form a real-world and useful product. 


## Best Payments Hack by Checkbook💵
On a branch of this project (checkbook-test), we have developed a basic billing button which would call Checkbook’s payment request API upon being pressed, which could swiftly be extended to a payment form (e.g. if we implemented a subscription service for using the MechaSort system).


## Most Innovative Hack by Meta💫

Though the MechaSort project we displayed impressive horizontal innovation by combining the raspberry pi camera (which we use as a lightweight monitoring system), arduino uno (which we use to provide visual cues as to the location of objects to potentially be picked up), and a manipulator arm with real-time state-of-the-art object recognition techniques. We are not aware of previous projects which have attempted this combination of project features (mechanical arm, object detection, web frontend controls), and working on this project allowed us to engage with an interplay of both hardware and software to a depth that we hadn’t before explored.

Our streamlined interface enables users to interact with all of these systems from the same easy-to-use software client and we designed a novel interface for interacting with the manipulator arm that allows users to drag joints of a prototype arm on the site to the desired configuration which is then exactly replicated by the physical arm. We also were able to apply an object recognition model in *real time*, creating a machine learning environment in which predictions can be immediately acted upon physically.
    

## Best Use of Data Hack by HRT📅

In the process of building out our backend, we curated a custom dataset of training photos that would be used training and validation datasets for our mechanical arm in detection tasks during the demo (given the resources we had). Our dataset comprised of 150 training photos of proxies for hazardous waste encountered in recycling streams. We collected this data by taking photos of samples for recyclable waste around us in various environments (to prevent overfitting on the image background, orientation, size and other irrelevant features of the image). We used stuffed socks as a proxy for dead animals, screwdrivers as a proxy for sharp objects like needles, and batteries to represent electronics. We then trained an object detection model on Microsoft Azure which was able to draw bounding boxes around these three classes of waste with high accuracy.
 

## Best Hack Using Frontier Tech by Pear🥇

In this project we were able to combine technologies and tools in *novel* ways. Though the MechaSort project we displayed impressive horizontal innovation by combining the raspberry pi camera (which we use as a lightweight monitoring system), arduino uno (which we use to provide visual cues as to the location of objects to potentially be picked up), and a manipulator arm with real-time state-of-the-art object recognition techniques. We are not aware of previous projects which have attempted this combination of project features (mechanical arm, object detection, web frontend controls).
