{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
  ];
  # Sets environment variables in the workspace
  env = {
    NODE_ENV = "development";
  };
  idx = {
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "./start.sh" ];
          env = { PORT = "$PORT"; };
          manager = "web";
        };
      };
    };
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [ 
      "ms-vscode.vscode-typescript-next"
      "esbenp.prettier-vscode"
      "ms-vscode.vscode-json"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        install = "npm install";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [ "app.js" "README.md" ];
      };
    };
  };
}
