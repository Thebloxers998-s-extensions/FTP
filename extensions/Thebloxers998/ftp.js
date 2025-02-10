(function(Scratch) {
    'use strict';

    const ArgumentType = Scratch.ArgumentType;
    const BlockType = Scratch.BlockType;
    const Cast = Scratch.Cast;

    class FTP {
        constructor() {
            this.ftpConfig = {};
        }

        getInfo() {
            return {
                id: 'ftp',
                name: 'FTP',
                blocks: [
                    {
                        opcode: 'setFTPConfig',
                        blockType: BlockType.COMMAND,
                        text: 'set FTP host to [FTPHOST] username to [FTPUSER] and password to [FTPPASS]',
                        arguments: {
                            FTPHOST: {
                                type: ArgumentType.STRING,
                                defaultValue: 'ftp.example.com'
                            },
                            FTPUSER: {
                                type: ArgumentType.STRING,
                                defaultValue: 'username'
                            },
                            FTPPASS: {
                                type: ArgumentType.STRING,
                                defaultValue: 'password'
                            }
                        }
                    },
                    {
                        opcode: 'uploadFile',
                        blockType: BlockType.COMMAND,
                        text: 'upload file [LOCALPATH] to [REMOTEPATH]',
                        arguments: {
                            LOCALPATH: {
                                type: ArgumentType.STRING,
                                defaultValue: 'path/to/local/file.txt'
                            },
                            REMOTEPATH: {
                                type: ArgumentType.STRING,
                                defaultValue: 'path/to/remote/file.txt'
                            }
                        }
                    }
                ]
            };
        }

        setFTPConfig(args) {
            this.ftpConfig = {
                host: args.FTPHOST,
                username: args.FTPUSER,
                password: args.FTPPASS
            };
            console.log('FTP configuration set:', this.ftpConfig);
        }

        async uploadFile(args) {
            const formData = new FormData();
            formData.append('file', args.LOCALPATH);

            const response = await fetch(`ftp://${this.ftpConfig.host}/${args.REMOTEPATH}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${this.ftpConfig.username}:${this.ftpConfig.password}`)
                },
                body: formData
            });

            if (response.ok) {
                console.log(`File uploaded to ftp://${this.ftpConfig.host}/${args.REMOTEPATH}`);
            } else {
                console.error('Failed to upload file');
            }
        }
    }

    Scratch.extensions.register(new FTP());
})(Scratch);
