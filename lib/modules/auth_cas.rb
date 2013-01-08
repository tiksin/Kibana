require 'casclient'
require 'lib/modules/auth_elasticsearch'
require 'lib/modules/elasticsearchmod'




# patch class string to be able to use casclient ...
class String
  def blank?
    self !~ /\S/
  end
end




class AuthCAS
  # Required function, accepts a KibanaConfig object
  def initialize(config)
    puts "Initializing CAS module"
    @cas_url = (defined? config::CAS_url) ? config::CAS_url : "https://cas.exemple.com:8443/"
    @cas_service = config::CAS_service + '/auth/cas'
    @cas_client = CASClient::Client.new({:cas_base_url => @cas_url})
    @proxy_auth = AuthElasticSearch.new(config)
  end

  # Required function, authenticates a username/password
  def authenticate(username,password)
    @proxy_auth.authenticate(username,password)
  end

  # Required function, returns user's groups membership
  def membership(username)
    return @proxy_auth.membership(username)
  end

  # Required function, returns a list of all groups
  def groups()
    @proxy_auth.groups()
  end

  # Required function, returns a list of all users
  def users()
    @proxy_auth.users()
  end

  # Required function, returns a list of all users in a group
  def group_members(group)
    @proxy_auth.group_members(group)
  end

  def delete_user(username)
    esm = Elasticsearchmod.new("kibana","user")
    esm.del_by_id(username)
  end

  def add_group(group, members)
    @proxy_auth.add_group(group, members)
  end

  def set_password(username, password)
    @proxy_auth.set_password(username, password) unless password.blank?()
  end

  def redirect_to_cas()
    #return 'https://cas.edqm.eu:8443/cas/login?service=http://weblog.edqm.eu/auth/cas'
    puts @cas_client.add_service_to_login_url(@cas_service)
    return @cas_client.add_service_to_login_url(@cas_service)
  end

  def get_service()
    #return "http://weblog.edqm.eu/auth/cas"
    return "http://192.168.128.49:5601/auth/cas"
  end

  def validate_ticket(params)
      ticket = params[:ticket]
      return nil unless ticket
      #log.debug("Request contains ticket #{ticket.inspect}.")
      if ticket =~ /^PT-/
        t = CASClient::ProxyTicket.new(ticket, @cas_service)
      else
        t = CASClient::ServiceTicket.new(ticket, @cas_service)
      end
      st = @cas_client.validate_service_ticket(t)
      return st
  end
end

# Required function, returns the auth
# class for this module.
def get_auth_module(config)
  return AuthCAS.new(config)
end

