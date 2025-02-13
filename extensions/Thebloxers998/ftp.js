// Name: FTP Extension
// ID: ftp-extension
// Description: Allows you to upload, download, and delete files via FTP. This must have punctuation at the end!
// By: Thebloxers998 <https://scratch.mit.edu/users/Thebloxers998/>
// Original: Thebloxers998
// License: MPL-2.0

(function(Scratch) {
    'use strict';

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const ArgumentType = Scratch.ArgumentType;
    const BlockType = Scratch.BlockType;
    const Cast = Scratch.Cast;

    class FTP {
        constructor() {
            this.ftpConfig = {};
        }

        getInfo() {
            return {
                id: 'ftp-extension',
                name: 'FTP Extension',
                color1: '#4C97FF', // Primary block color
                color2: '#3373CC', // Secondary block color
                color3: '#2959A3', // Tertiary block color
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
                    },
                    {
                        opcode: 'downloadFile',
                        blockType: BlockType.COMMAND,
                        text: 'download file from [REMOTEPATH] to [LOCALPATH]',
                        arguments: {
                            REMOTEPATH: {
                                type: ArgumentType.STRING,
                                defaultValue: 'path/to/remote/file.txt'
                            },
                            LOCALPATH: {
                                type: ArgumentType.STRING,
                                defaultValue: 'path/to/local/file.txt'
                            }
                        }
                    },
                    {
                        opcode: 'deleteFile',
                        blockType: BlockType.COMMAND,
                        text: 'delete file [REMOTEPATH]',
                        arguments: {
                            REMOTEPATH: {
                                type: ArgumentType.STRING,
                                defaultValue: 'path/to/remote/file.txt'
                            }
                        }
                    },
                    {
                        opcode: 'fileExists',
                        blockType: BlockType.BOOLEAN,
                        text: 'file [REMOTEPATH] exists?',
                        arguments: {
                            REMOTEPATH: {
                                type: ArgumentType.STRING,
                                defaultValue: 'path/to/remote/file.txt'
                            }
                        }
                    },
                    {
                        opcode: 'whenFileUploaded',
                        blockType: BlockType.HAT,
                        text: 'when file uploaded [REMOTEPATH]',
                        arguments: {
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
                runtime.startHats('ftp-extension_whenFileUploaded', {
                    REMOTEPATH: args.REMOTEPATH
                });
                console.log(`File uploaded to ftp://${this.ftpConfig.host}/${args.REMOTEPATH}`);
            } else {
                console.error('Failed to upload file');
            }
        }

        async downloadFile(args) {
            const response = await fetch(`ftp://${this.ftpConfig.host}/${args.REMOTEPATH}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${this.ftpConfig.username}:${this.ftpConfig.password}`)
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = args.LOCALPATH;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                console.log(`File downloaded from ftp://${this.ftpConfig.host}/${args.REMOTEPATH}`);
            } else {
                console.error('Failed to download file');
            }
        }

        async deleteFile(args) {
            const response = await fetch(`ftp://${this.ftpConfig.host}/${args.REMOTEPATH}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${this.ftpConfig.username}:${this.ftpConfig.password}`)
                }
            });

            if (response.ok) {
                console.log(`File deleted from ftp://${this.ftpConfig.host}/${args.REMOTEPATH}`);
            } else {
                console.error('Failed to delete file');
            }
        }

        async fileExists(args) {
            const response = await fetch(`ftp://${this.ftpConfig.host}/${args.REMOTEPATH}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${this.ftpConfig.username}:${this.ftpConfig.password}`)
                }
            });

            return response.ok;
        }
    }

    Scratch.extensions.register(new FTP());
})(Scratch);
