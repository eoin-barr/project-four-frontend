# Painterest

### Project Overview

I teamed up with [Harry Evans](https://github.com/hatch9191) for this project as we had worked well together on a [previous project](https://github.com/eoin-barr/project-three-frontend) and were both interested in utilising Django's relational database model to implement social-media features including user messaging and following, ontop of the basic CRUD functionality. This project was built in 7 days with a React frontend and Python & Django backend. Check out the [deployed app here](https://painterest.netlify.app/). Create an account or use Username: Guest Password: pass.

<p align="center">
  <img style="height:400px;width:auto" src="https://res.cloudinary.com/dk0r9bcxy/image/upload/v1637604544/READMEs/bg-painterest_xklhwn.png" />
</p>

### Technologies Used

#### Backend

- Python
- Django
- Django REST Framework
- Psycopg2
- pyJWT
- PostgreSQL

#### Frontend

- React
- JavaScript
- HTML5
- SCSS
- Bootstrap
- React Cloudinary Upload Widget
- React Select

#### Dev Tools

- npm
- insomnia
- TablePlus
- Git
- GitHub
- Netlify
- Heroku

## Planning & Backend Setup

We decided our home, image-feed, image-display and user-profile pages would be based on Pinterest's design and the chat pages would be based on WhatsApp's design. We did this to reduce the time needed for wireframing with excalidraw, allowing us to spend more time planning all the functionality we wanted this application to have.

We then moved onto planning out the backend database. To help us with this we used an ERD diagram to help visualise relationships between the tables. We researched methods of imlpementing messages, and ultimately decided against using WebSockets due to time constraints. We settled on creating a ‘chatroom’ for each user-to-user message conversation that would enable us to check if conversations already existed between two users. The Chats would then lend their primary key to all the messages sent between the users.

With our theory now clear, we first built out the rest of the backend that we were confident in doing, before tackling the messaging views. We found many interesting ways of filtering in Django, however, we ultimately decided to use the Q object, which allowed us to make more complex filters.

```python
class ChatListView(APIView):
   # filtered chats to find chat of user and profile the user is on
   permission_classes = (IsAuthenticated, )

   def get(self, request, profile_pk):
       sender = request.user.id
       recipient = profile_pk
       chats = Chat.objects.filter(
           (Q(user_a=sender) & Q(user_b=recipient)) |
           (Q(user_b=sender) & Q(user_a=recipient)))
       serialized_chat = CreateChatSerializer(chats, many=True)
       return Response(serialized_chat.data, status=status.HTTP_200_OK)
```

If a Chat relationship existed between two users we could then show their messages with a view using the Chat primary key or if no relationship existed yet, we could use the `ChatCreateView` to make a new chat between them. I also implemented additional message views when I realised that they would be required when requesting the data from different locations on the frontend.

To achieve the follow functionality in the application we created the `UserFollowView` which used a toggle appraoch to achieve our desired result and also simplified the work required on the frontend.

```python
class UserFollowView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, pk):
        try:
            user_to_follow = User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise NotFound()
        if request.user in user_to_follow.followed_by.all():
            user_to_follow.followed_by.remove(request.user.id)
        else:
            user_to_follow.followed_by.add(request.user.id)
        serialized_followed_user = UserProfileSerializer(user_to_follow)
        return Response(serialized_followed_user.data, status=status.HTTP_202_ACCEPTED)
```

## Displaying User Chats

Displaying the user chats really pushed my knowledge of working with array methods within JavaScript. To display the most recent message of every chat a user was in, ordered based on most recent, I had to implement nested sorting. The first sort was used to sort all of the users chats based on the most recent, while the two inner sorts were used to get the most recent message within each chat.

```javascript
const filterByMostRecent = () => {
  const filterChats = userChats.filter((chat) => {
    if (chat.messages.length > 0) {
      return chat;
    }
  });
  return filterChats.sort((a, b) => {
    a = a.messages.sort((c, d) => {
      c = c.id;
      d = d.id;
      return d - c;
    })[0].id;
    b = b.messages.sort((e, f) => {
      e = e.id;
      f = f.id;
      return f - e;
    })[0].id;
    return b - a;
  });
};
```

## Challenges

- Coming up with the chat/message relationship and implementing the functionality was an aspect we spent a lot of time researching. We found the theory behind the concept very interesting, but it took a while and lots of discssion before we both fully got our heads around the specifics involved with its implementation. Overall we were happy with the outcome, as it achieved what we had originally planned.

## Potential Improvements

- Using WebSockets to implement user-messaging to enable messags to appear without the need for a state update or page refresh.
- Implementing staggered loading for the image feed and user messaging. Using staggered loading based on scroll would increase load speed times, as well as provide a more realistic experience to users.

## Key Learnings

- This project reinforced the importance of planning every aspect of the project before writing any code. This application had a lot of interconnected components (e.g. users-chats being accessible as a dropdown from within the navbar) and so planning ahead enabled us to navigate around many potential pitfalls.
- Using Python for the first time in a project was very enjoyable. I found it very interesting and beneficial being able to compare the different functionality and syntax between Python and JavaScript.
