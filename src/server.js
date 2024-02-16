const http = require("http");
const { shoppingList, addItem, togglePurchased, removeItem, calculateTotalCost} = require("./shoppingListFunctions");
const port = 3000;

const server = http.createServer((req, res) => {
  let body = "";

  req
    .on("data", (chunk) => {
      body += chunk;
    })
    .on("end", () => {
      // makes sure that the body is from request is not empty, and if it is, amkes it an empty object
      body = body.length > 0 ? JSON.parse(body) : {};

      const contentType = { "Content-Type": "application/json" };

      if (req.url.startsWith("/items")) {
        // if the request.url starts with /items
        // for your put and delete request you will need an index to know where you are deleting or updating
        // here you are storing the index that will be at the end of the request url if one is there
        let index = parseInt(req.url.split("/")[2]);

        // switch statements to execute code based on what http verb you are using
        switch (req.method) {
          case "POST":
            // console.log("POST REQUEST");
            // deconstructing the bodyto access only the name and price properties from the request body
            const { name, price } = body;

            // checking to make sure the name and price are not falsy values
            if (!name || !price) {
              // if they are, send error
              res.writeHead(400, contentType);
              res.end(
                JSON.stringify({
                  message: "Please provide valid names or prices",
                })
              );
            } else {
              // if they are truthy values
              // declare a message variable that will be sent back as the response
              // execute addItem() function using the name and price properties of the request
              const message = addItem(name, price);
              res.writeHead(201, contentType);
              // responds with the message variabel and the current shopping list with new item added
              res.end(JSON.stringify({ message, shoppingList }));
            }
            break;


          case "PUT":
            // passingthe index from the request URL so we know what index in the shopping list array we are going to update
            const putMessage = togglePurchased(index);
            res.writeHead(200, contentType);
            // responds with the message variabel which is what is returned from the function and the current shopping list with updated items purchased property updated
            res.end(JSON.stringify({putMessage, shoppingList}));
            break;


          case "DELETE":
            // passingthe index from the request URL so we know what index in the shopping list array we are going to delete
            const deleteMessage = removeItem(index);
            res.writeHead(200, contentType);
            res.end(JSON.stringify({deleteMessage, shoppingList}));
            break;

            
          case "GET":
            res.writeHead(200, contentType);
            res.end(JSON.stringify({shoppingList, totalCost: calculateTotalCost()}));
            break;
          default:
            res.writeHead(404, contentType);
            res.end(JSON.stringify({message: "Invalid Endpoint"}))
            break;
        }
      } else {
        res.writeHead(404, contentType);
        res.end(JSON.stringify({message: "Invalid Endpoint"}))
      }
    });
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
