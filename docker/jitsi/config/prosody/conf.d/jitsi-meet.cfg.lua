admins = {
    

    

    "focus@auth.localhost",
    "jvb@auth.localhost"
}

unlimited_jids = {
    "focus@auth.localhost",
    "jvb@auth.localhost"
}

plugin_paths = { "/prosody-plugins-custom", "/prosody-plugins/", "/prosody-plugins-contrib" }

muc_mapper_domain_base = "localhost";
muc_mapper_domain_prefix = "muc";

recorder_prefixes = { "recorder@hidden.meet.jitsi" };

transcriber_prefixes = { "transcriber@hidden.meet.jitsi" };

http_default_host = "localhost"


asap_accepted_issuers = { "health-ease" }



asap_accepted_audiences = { "jitsi" }




consider_bosh_secure = true;
consider_websocket_secure = true;


smacks_max_unacked_stanzas = 5;
smacks_hibernation_time = 60;
smacks_max_old_sessions = 1;




VirtualHost "localhost"

  
  authentication = "token"
    app_id = "health-ease"
    
    app_secret = "5f8405d886844ccbb67f9621f769679392a2090b709c4e2289ae1e3f5a0b649d"
    
    allow_empty_token = false
    
    enable_domain_verification = false
  

    ssl = {
        key = "/config/certs/localhost.key";
        certificate = "/config/certs/localhost.crt";
    }
    modules_enabled = {
        "bosh";
        "features_identity";
        
        "websocket";
        "smacks"; -- XEP-0198: Stream Management
        
        "conference_duration";
        
        "muc_lobby_rooms";
        
        
        "muc_breakout_rooms";
        
        
        
        
        

    }

    main_muc = "muc.localhost"
    
    lobby_muc = "lobby.localhost"
    
    

    

    
    breakout_rooms_muc = "breakout.localhost"
    

    c2s_require_encryption = true

    

    

VirtualHost "auth.localhost"
    ssl = {
        key = "/config/certs/auth.localhost.key";
        certificate = "/config/certs/auth.localhost.crt";
    }
    modules_enabled = {
        "limits_exception";
        "smacks";
    }
    authentication = "internal_hashed"
    smacks_hibernation_time = 15;



Component "internal-muc.localhost" "muc"
    storage = "memory"
    modules_enabled = {
        "muc_hide_all";
        "muc_filter_access";
        }
    restrict_room_creation = true
    muc_filter_whitelist="auth.localhost"
    muc_room_locking = false
    muc_room_default_public_jids = true
    muc_room_cache_size = 1000
    muc_tombstones = false
    muc_room_allow_persistent = false

Component "muc.localhost" "muc"
    restrict_room_creation = true
    storage = "memory"
    modules_enabled = {
        "muc_hide_all";
        "muc_meeting_id";
        "token_verification";
        
        "muc_domain_mapper";
        
        "muc_password_whitelist";
        
    }

    -- The size of the cache that saves state for IP addresses
    rate_limit_cache_size = 10000;

    muc_room_cache_size = 10000
    muc_room_locking = false
    muc_room_default_public_jids = true
    
    muc_password_whitelist = {
        "focus@auth.localhost";
    }
    muc_tombstones = false
    muc_room_allow_persistent = false

Component "focus.localhost" "client_proxy"
    target_address = "focus@auth.localhost"

Component "speakerstats.localhost" "speakerstats_component"
    muc_component = "muc.localhost"


Component "endconference.localhost" "end_conference"
    muc_component = "muc.localhost"



Component "avmoderation.localhost" "av_moderation_component"
    muc_component = "muc.localhost"



Component "lobby.localhost" "muc"
    storage = "memory"
    restrict_room_creation = true
    muc_tombstones = false
    muc_room_allow_persistent = false
    muc_room_cache_size = 10000
    muc_room_locking = false
    muc_room_default_public_jids = true
    modules_enabled = {
        "muc_hide_all";
    }

    


Component "breakout.localhost" "muc"
    storage = "memory"
    restrict_room_creation = true
    muc_room_cache_size = 10000
    muc_room_locking = false
    muc_room_default_public_jids = true
    muc_tombstones = false
    muc_room_allow_persistent = false
    modules_enabled = {
        "muc_hide_all";
        "muc_meeting_id";
        }


Component "metadata.localhost" "room_metadata_component"
    muc_component = "muc.localhost"
    breakout_rooms_component = "breakout.localhost"




Component "polls.localhost" "polls_component"
