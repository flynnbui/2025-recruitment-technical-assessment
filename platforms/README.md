# DevSoc Subcommittee Recruitment: Platforms
Your task is to send a direct message to the matrix handle `@chino:oxn.sh` using the Matrix protocol. However, this message must be sent over a self hosted instance such as through the Conduwuit implementation or the slightly more complicated Synapse implementation.

For this to work your server must be federated, but you do not have to worry about specifics such as using your domain name as your handle (a subdomain will do!) or have other 'nice to have' features. Just a message will do!

**You should write about what you tried and your process in the answer box below.**

This task intentionally sounds challenging and contains language not frequently used in platforms as it refers to a specific protocol. The aim of this task is to research and make sense to some of the various terminology. If you don't manage to get this working we'll still want to hear about what you tried, what worked and what didn't work, etc, as knowledge isn't required, just the ability to try figure things out! Good luck!

---

> ANSWER BOX
```
I recently deployed a Matrix homeserver on AWS using a guide I found(https://hik999.medium.com/cloud-deployment-of-matrix-homeserver-f08ba5e8109e),  but let’s just say it wasn’t exactly plug-and-play (it took me 5 hours just to get the server up ...). The guide was a bit outdated and left out some key details on configuring the server, I had to dive into the docs myself and figure things out..
Luckily, I’m taking COMP6448, aka security for cloud. That means I’ve got an AWS account with pretty much unlimited instances and RDS as long as I follow the golden rule of security class: "Don’t be a dick." Lmao.

Setting up the AWS infrastructure was relatively straightforward with the guide:
Created a VPC with public/private subnets
Configured an Internet Gateway and proper routes
Set up security groups for the Matrix server and database
Allocated an Elastic IP
Launched an RDS PostgreSQL instance and EC2 server
Configured DNS records (SRV, A records)

By using this (https://github.com/spantaleev/matrix-docker-ansible-deploy/), it's kinda easy to start a Matrix container.
The server is now running at matrix.thebct.net
Username: chino
Password: Pleas3l3tmebey0urSubcommitee

I’m still working on the TLS configuration, trying to get the certs right for both the base domain and the Matrix server. Right now, I can only send messages to myself, which is super cool if you enjoy talking to yourself 🤡. Once I get federation working properly, I should be able to connect with other Matrix servers. 
```
