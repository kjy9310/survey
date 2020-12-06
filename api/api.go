package main

import (
	"log"
	"time"
	"survey-api/model"
	"survey-api/controller"
	"survey-api/router"
	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	
	// "io/ioutil"
	// "log"
	// "fmt"
	// "flag"
)

var identityKey = "Id"

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {

        c.Header("Access-Control-Allow-Origin", "*")
        c.Header("Access-Control-Allow-Credentials", "true")
        c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}

func main() {
	// var env string
	// flag.StringVar(&env, "env", "development", "environment value : development/production")
	// flag.Parse()
	// fmt.Print(env)
		// gin.SetMode(gin.ReleaseMode)	
	r := gin.New()

	r.Use(gin.Logger())
	/* @ middle ware : recovery runs when panic happens */
	r.Use(gin.Recovery())
	r.Use(CORSMiddleware())
	apiRouterGroup := r.Group("/api")
	
	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		// Realm:       "test zone",
		Key:         []byte("secret key"),
		Timeout:     time.Hour,
		MaxRefresh:  time.Hour,
		IdentityKey: identityKey,
		PayloadFunc: func(data interface{}) jwt.MapClaims {
			log.Println("PayloadFunc : ", data.(*model.Publisher))
			if v, ok := data.(*model.Publisher); ok {
				return jwt.MapClaims{
					identityKey: v.Id,
				}
			}
			return jwt.MapClaims{}
		},
		IdentityHandler: func(c *gin.Context) interface{} {
			claims := jwt.ExtractClaims(c)
			log.Println("IdentityHandler claims : ", claims)
			return &model.Publisher{
				Id: int(claims[identityKey].(float64)),
			}
		},
		Authenticator: func(c *gin.Context) (interface{}, error) {
			log.Println("Authenticator : ")
			return controller.Signin(c)
		},
		Authorizator: func(data interface{}, c *gin.Context) bool {
			log.Println("Authorizator : ", data.(*model.Publisher))
			if _, ok := data.(*model.Publisher); ok {
				return true
			}
			return false
		},
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"code":    code,
				"message": message,
			})
		},
		// TokenLookup is a string in the form of "<source>:<name>" that is used
		// to extract token from the request.
		// Optional. Default value "header:Authorization".
		// Possible values:
		// - "header:<name>"
		// - "query:<name>"
		// - "cookie:<name>"
		// - "param:<name>"
		TokenLookup: "header: Authorization, query: token, cookie: jwt",
		// TokenLookup: "query:token",
		// TokenLookup: "cookie:token",

		// TokenHeadName is a string in the header. Default value is "Bearer"
		TokenHeadName: "Bearer",

		// TimeFunc provides the current time. You can override it to use another time value. This is useful for testing or if your server uses a different time zone than your tokens.
		TimeFunc: time.Now,
	})

	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}

	// When you use jwt.New(), the function is already automatically called for checking,
	// which means you don't need to call it again.
	errInit := authMiddleware.MiddlewareInit()

	if errInit != nil {
		log.Fatal("authMiddleware.MiddlewareInit() Error:" + errInit.Error())
	}

	apiRouterGroup.POST("/signin", authMiddleware.LoginHandler)
	apiRouterGroup.POST("/signup", controller.Signup)

	// Refresh time can be longer than token timeout
	apiRouterGroup.GET("/refresh_token", authMiddleware.RefreshHandler)
	
	//check auth
	apiRouterGroup.Use(authMiddleware.MiddlewareFunc())

	/* @ router groups */
	router.InitRoutes(apiRouterGroup)

	r.Run() // listen and serve on 0.0.0.0:8080
}