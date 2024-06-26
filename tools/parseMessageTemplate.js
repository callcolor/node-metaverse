const fs = require('fs');

function getParams(str)
{
    let started = false;
    let lastSpace = false;
    let params = '';
    for(let i = 0; i < str.length; i++)
    {
        const c = str[i];
        if (c === '{' || c === '}')
        {
            return params.trim();
        }
        else if (c === ' ' || c === '\t')
        {
            if (started && !lastSpace)
            {
                params+=' ';
                lastSpace = true;
            }
        }
        else if (c === '\n' || c === '\r')
        {
            //ignore
        }
        else
        {
            started = true;
            lastSpace = false;
            params += c;
        }
    }
    return params.trim();
}

function getBlocks(str)
{
    let started = false;
    let count = 0;
    let startPos = 0;
    let block = [];
    for(let i = 0; i < str.length; i++)
    {
        if (str[i] === '{')
        {
            if (count === 0)
            {
                if (!started)
                {
                    started = true;
                    startPos = i;
                }
            }
            count++
        }
        else if (str[i] === '}')
        {
            count--;
            if (count === 0)
            {
                let s = str.substring(startPos + 1, i);
                block.push(s);
                started = false;
            }
        }
    }
    return block;
}

fs.readFile('./message_template.msg', (err, data) =>
{
    if (err)
    {
        console.error(err);
    }
    else
    {
        let msgTemplate = data.toString('ascii');

        //Remove all comments
        const lines = msgTemplate.split('\n');
        let newLines = [];
        for (let line of lines)
        {
            const pos = line.indexOf('//');
            if (pos !== -1)
            {
                line = line.substring(0, pos-1);
            }
            newLines.push(line);
        }
        msgTemplate = newLines.join('\n');


        let messages = getBlocks(msgTemplate);
        let msgObjects = [];
        for (const message of messages)
        {
            let newMessage = {};

            let params = getParams(message);

            params = params.split(' ');
            newMessage.name = params[0];
            newMessage.frequency = params[1];
            newMessage.id = params[2];
            newMessage.flags = [];
            newMessage.blocks = [];
            for(let i = 3; i < params.length; i++)
            {
                newMessage.flags.push(params[i]);
            }

            let blocks = getBlocks(message);
            for (const block of blocks)
            {
                let newBlock = {};
                params = getParams(block);
                params = params.split(' ');
                newBlock.name = params[0];
                newBlock.type = params[1];
                newBlock.count = 1;
                newBlock.params = [];
                if (params.length>2)
                {
                    newBlock.count = params[2]
                }

                let paramBlocks = getBlocks(block);
                for (const paramBlock of paramBlocks)
                {
                    let data = getParams(paramBlock);
                    data = data.split(' ');

                    let obj = {
                        'name': data[0],
                        'type': data[1],
                        'size': 1
                    };
                    if (data.length>2)
                    {
                        obj['size'] = data[2];
                    }
                    newBlock.params.push(obj);
                }

                newMessage.blocks.push(newBlock);
            }
            msgObjects.push(newMessage);
        }

        fs.writeFile('./msg_template.json', JSON.stringify(msgObjects, null, 4), (err) =>
        {
            console.log("JSON written");
        });
    }
});
