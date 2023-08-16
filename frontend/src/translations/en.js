const ENGLISH = {
    "general_title": "Liar's Dice",
    "welcome_title": "Welcome",
    "welcome_subtitle": "Don't have a room key ? You can create your own game room from here.",
    "create_room_button_text": "Create New Room",
    "logout_button_text": "Logout",
    "logout_success_text": "You have successfully logged out",
    
    "join_room_header": "Join Room",
    "join_room_subtitle": "Just by using Room Id",
    "join_room_button": "Join Room",
    "reconnect_room_button": "Reconnect Game",
    "reconnect_room_subtitle": `Looks like you are already a member of room. Do you want to reconnect back ?`,

    "abaddon_room_button_text": "Abaddon Game",


    "error_already_joined_room_name": "You are already member of this room. If you want to reconnect, please click :",
    "error_room_not_exist": "Room not exist",
    "error_maximum_room_players_exceeded": "Maximum player exceeded in room. You are not able to join until someone leaves.",
    "error_already_another_room_member": "You are already member of this room.\nPlease click to reconnect:\n",
    
    "room_id_text_place_holder": "Room Id",
    "username_text_place_holder": "Username",

    "create_room_title": "Create New Room",
    "create_room_subtitle": "Create your own liar's Dice room and share it via link and room id!",
    "create_room_button": "Create Room",

    "error_authentication_failed" : "Authentication Failed. Please sign-in again.",
    "error_user_already_another_room_member": "You are already member of another room",
    "error_room_already_exist": "This room is already exist",

    "error_already_not_authenticated": "You are already not logged in",
    "error_room_member_cannot_logout": "You are a member of game room. You can not logout and login as new user until leaving your current room. Please leave your room first",

    "do_you_want_to_join_room": "Do you want to join existing room ?",
    "is_someone_waiting_you": "Is there anybody waiting for you ? Do not make them angry. Join existing play room by here.",

    "title_choose_your_bet": "Declare your bet",
    "title_lastest_bet": "Lastest bet",
    "subtitle_lastest_bet": "You should declare equal or higher amounted bet. Or you can call bluff for lastest declared bet.",
    "title_action": "Actions",
    "title_bet_amount": "Amount",
    "title_bet_dice": "Dice",

    "button_declare_bet": "Declare Your Bet",
    "button_call_bluff": "Call Bluff",

    "error_message_screen_size_not_compatible": "Screen size is not compatible. You need least 1300x700 display for playing Liar's Dice",
    "error_message_room_id_is_not_valid": "Room Id is not valid or expired. Return home page to join another room or create one.",

    "info_panel_waiting_for_game_start": "Waiting for game start",
    "info_panel_eliminated": "You are eliminated !",
    "info_panel_subtitle_waiting_for_game_start": "You are waiting game to start with other players. Room manager can start the game when there is more than one player in the room",
    "info_panel_subtitle_eliminated": "You lost your all dices. So, you are not able to declare bid or taking any action until next game.",

    "modal_how_to_play_title_1": "How to Play Liar's Dice",
    "modal_how_to_play_html_content_1": `
        <b>Introduction:</b></br></br>
        Liar's Dice is an exciting and strategic dice game that has been played for centuries.
        It involves bluffing, deduction, and a keen sense of probability.
        In this guide, we will walk you through the rules and steps to play Liar's Dice.
        </br></br>
        <b>Objective:</b></br>
        The objective of Liar's Dice is to be the last player with dice remaining.
        Players make bids on the total number of dice with a particular face value on the table, 
        and the bidding continues until someone challenges the previous bid, suspecting it to be a lie. The game is played with a set of five dice per player.
        </br></br>
        <b>Game Setup:</b></br>
        <ol type="1">
            <li>Gather a group of at least two players, but the game is more enjoyable with four or more players.</li>
            </br>
            <li>Each player should have a cup or container to conceal their dice.</li>
            </br>
            <li>Decide on the starting player. This can be determined randomly or by mutual agreement.</li>
        </ol>
    `,

    "modal_how_to_play_title_2": "Gameplay",
    "modal_how_to_play_html_content_2": `
       <ol type="1">
            <li>All players shake their dice in their cups, keeping them concealed from others.</li>
            </br>
            <li>The starting player makes a bid by announcing the quantity of a particular face value 
            they believe exists among all players' concealed dice. For example, a bid could be "three threes," 
            indicating that the player believes there are at least three dice showing a three on the table.</li>
            </br>
            <li>The next player in turn order can either increase the quantity of the same face value or 
            challenge the previous bid. If they wish to challenge, they announce "liar."</li>
            </br>
            <li>If the bid is challenged, all players reveal their dice. If the total quantity of 
            the bid's face value is equal to or greater than the bid, the bidder wins, and the challenger 
            loses a die. Otherwise, the challenger wins, and the bidder loses a die.</li>
            </br>
            <li>The player who lost a die starts the next round. If multiple players lose a die, 
            the player next in turn order starts.</li>
            </br>
            <li>The game continues with players making bids, increasing the quantity or challenging, 
            until only one player remains with dice. That player is declared the winner.</li>
       </ol>
    `,

    "modal_how_to_play_title_3": "Rules for Bidding:",
    "modal_how_to_play_html_content_3": `
        <ol type="1">
            <li>The face value of a bid must be higher than the previous bid, or the bid can increase the quantity of the same face value.</li>
            </br>
            <li>Players can bid on any face value, including face value of the dice that have been revealed.</li>
            </br>
            <li>The face value of "ones" is considered the highest, followed by "sixes," "fives," and so on, in descending order.</li>
        </ol>
        </br>
        <b>Bluffing and Deduction:</b>
        </br></br>
        Liar's Dice involves bluffing and deduction, as players can choose to make bids that are not entirely truthful.
        </br></br>
        Players must carefully observe previous bids, calculate probabilities, and assess the likelihood of the bid being accurate.
        </br></br>
        Bluffing can be a valuable strategy to deceive opponents or force them into challenging bids that may be truthful.
    `,

    "modal_how_to_play_title_4": "Tips:",
    "modal_how_to_play_html_content_4": `
        <ol type="1">
            <li>Pay attention to the bids made by other players and the number of dice revealed.</li>
            </br>
            <li>Keep track of the number of dice remaining in the game and adjust your bids accordingly.</li>
            </br>
            <li>Bluff strategically, but be mindful of your opponents' bids and reactions.</li>
            </br>
            <li>Analyze the probability of a bid being accurate based on the dice already revealed.</li>
        </ol>
    `, 

    "start_game_nav": "Start Game",
    "how_to_play_nav": "How To Play",
    "exit_room_nav": "Exit Room",
    "language_nav": "Language",
    "button_next": "Next",
    "button_ok": "OK",

    "modal_leave_room_title": "Do you want to leave room ?",
    "modal_leave_room_subtitle": "Of course you can join back later ...",
    "modal_leave_room_accept_button": "Yes",
    "modal_leave_room_decline_button": "No",

    "modal_leave_room_for_empty_room_subtitle": "Looks like there is no one here except you. This room will deleted if you leave. ",
    "modal_leave_room_for_admin_subtitle": "Looks like you are room admin. If you leave room once, you will lose admin rights forever ",

    "modal_create_session_title": "Welcome To Liar's Dice",
    "modal_create_session_subtitle": "Create your account. No email or another additional information needed !",
    "modal_create_session_accept_button": "Create Account",
    
    "modal_server_stastus_failure_title": "Welcome To Liar's Dice",
    "modal_server_stastus_failure_subtitle": "Unfortunately, Liar's Dice server is not accessible for now. Please retry from here 👇",
    "modal_server_stastus_failure_retry_button": "Retry",

    "modal_loading_title": "Loading . . .",
    "modal_loading_subtitle": "Connecting to Liar's Dice Servers",


}

module.exports = ENGLISH