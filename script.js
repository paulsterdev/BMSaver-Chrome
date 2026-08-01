

const nameField = document.getElementById("nameField");
const urlField = document.getElementById("urlField");
const folderSelector = document.getElementById("folderSelectorMenu")
const saveButton = document.getElementById("saveButton");
const clearButton = document.getElementById("clearButton");
const message = document.getElementById("error");

const folderNames = [];
const folderIDs = [];
var folderID = "";
var folderName = ``;
var selectItemsHTML = ``;



function handleError(error)
{
    console.error(`Error occured: ${error}`);
}

function updateFolders(bookmarkItem) 
{
    if (!(bookmarkItem.url) && (bookmarkItem.title))
    {
        folderID = bookmarkItem.id.toString();
        folderIDs.push(folderID);
        let folderName = "";
        let parentFolderFound = false;
        let folderIDsIndex = 0;

        for (let index = 0; index < folderIDs.length; index++)
        {
            if (folderIDs[index] == bookmarkItem.parentId)
            {
                parentFolderFound = true;
                folderIDsIndex = index;
                break;
            }
        }
        if (parentFolderFound)
        {
            folderName = (folderNames[folderIDsIndex] + "/" + (bookmarkItem.title.toString().toUpperCase()));
        }
        else
        {
            folderName = bookmarkItem.title.toString().toUpperCase();
        }
        folderNames.push(folderName);

        
    }
    if (bookmarkItem.children)
    {
        for (const child of bookmarkItem.children) 
        {
            updateFolders(child);
        }
    }
    
    }  

function getItems(bookmarkItems) 
{
  updateFolders(bookmarkItems[0]);
}

function writeHTML(){
    for (var i = 0; i < folderNames.length; i++)
    {
    selectItemsHTML += 
    `<option value="${folderIDs[i]}">${folderNames[i]}</option>
    `
    }
    folderSelector.innerHTML = 
`
    <label for="folderSelector">FOLDER:</label>
        <select
        name="folder"
        id="folder">
        ${selectItemsHTML}
        </select>
`;
}

function addBookmark(parentId, title, url)
{
    clearError();
    console.log(parentId)
    let newBookmark = chrome.bookmarks.create({'parentId': parentId,'title': title,'url': url,});
    newBookmark.catch(error => catchError(error));
}

function displayMessage(errorText, messageColor)
{
    message.style.color = messageColor;
    message.innerHTML = `${errorText}`;
}

function catchError(error)
{
    if (error == "Error: Invalid URL.")
    {
        console.log(error)
        urlField.style.border = "1px solid red";
        displayMessage("INVALID URL FORMAT.", "red");
    }
    else
    {
        console.log(error);
    }
}

function clearError()
{
    message.innerHTML = ``;
    nameField.style.border = "1px solid black";
    urlField.style.border = "1px solid black";
}

function controlFields()
{
    console.log("In controlfields()")
    const folderOptions = document.getElementById("folder");
    saveButton.addEventListener("click", () => 
    {
        var title = nameField.value;
        var url = urlField.value;
        var parentId = folderOptions.value;
        if(!title || !url)
        {
            if (!title && !url)
            {
                nameField.style.border = "1px solid red";
                urlField.style.border = "1px solid red";
                displayMessage("NAME AND URL CANNOT BE BLANK.", "red")
            }
            else if(!title)
            {
                nameField.style.border = "1px solid red";
                displayMessage("NAME CANNOT BE BLANK.", "red");
            }
            else if(!url)
            {
                displayMessage("URL CANNOT BE BLANK.", "red");
                urlField.style.border = "1px solid red";
            }

        }
        else
        {
            addBookmark(parentId, title, url);
        }
        
    }
    )

    clearButton.addEventListener("click", () => 
    {
        clearError();
        nameField.value = "";
        urlField.value = "";
        folderOptions.selectedIndex = 0;
        controlFields();
    }
    )
}

let BMObject = chrome.bookmarks.getTree();
BMObject.then(getItems, handleError)
        .then(writeHTML,handleError)
        .then(controlFields, handleError)
        .catch(e => {
    console.log(e);
});



